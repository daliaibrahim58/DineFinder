/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  Button,
  Tooltip,
  Drawer,
} from "@mui/material";

import {
  DeleteOutlined,
  Add,
  Send,
  SmartToy,
  Person,
  Close,
  Menu as MenuIcon,
} from "@mui/icons-material";

import {
  useRagChatMutation,
  useGetConversationsQuery,
  useLazyGetConversationQuery,
  useDeleteConversationMutation,
} from "@/redux/api/restaurantApi";

import { useAppSelector } from "@/redux/hooks";

import type { RagRestaurant } from "@/types/restaurant";

// =====================================================
// Local Message
// =====================================================

interface LocalMessage {
  id: string;

  role: "user" | "assistant";

  content: string;

  restaurants?: RagRestaurant[];
}

// =====================================================
// Component
// =====================================================

export default function RestaurantChatbot() {
  const router = useRouter();

  // =====================================================
  // Auth
  // =====================================================

  const user = useAppSelector((state) => state.auth.user);

  // =====================================================
  // Chat Open
  // =====================================================

  const [open, setOpen] = useState(false);

  // =====================================================
  // Mobile Conversations Drawer
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // Conversation ID
  // =====================================================

  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );

  // =====================================================
  // Messages
  // =====================================================

  const [messages, setMessages] = useState<LocalMessage[]>([]);

  // =====================================================
  // Input
  // =====================================================

  const [input, setInput] = useState("");

  // =====================================================
  // Login Message
  // =====================================================

  const [loginRequired, setLoginRequired] = useState(false);

  // =====================================================
  // Chat Mutation
  // =====================================================

  const [ragChat, { isLoading: isChatLoading }] = useRagChatMutation();

  // =====================================================
  // Conversations List
  // =====================================================

  const {
    data: conversationsData,
    isLoading: isConversationsLoading,
    refetch: refetchConversations,
  } = useGetConversationsQuery(undefined, {
    skip: !user,
  });

  // =====================================================
  // Lazy Conversation Query
  // =====================================================

  const [getConversation, { isFetching: isConversationFetching }] =
    useLazyGetConversationQuery();

  // =====================================================
  // Delete Mutation
  // =====================================================

  const [deleteConversation, { isLoading: isDeletingConversation }] =
    useDeleteConversationMutation();

  // =====================================================
  // Scroll Ref
  // =====================================================

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // =====================================================
  // Auto Scroll
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isChatLoading]);

  // =====================================================
  // Conversations
  // =====================================================

  const conversations = useMemo(
    () => conversationsData?.data || [],
    [conversationsData],
  );

  // =====================================================
  // New Chat
  // =====================================================

  const handleNewChat = () => {
    setConversationId(undefined);

    setMessages([]);

    setInput("");

    setLoginRequired(false);

    setSidebarOpen(false);
  };

  // =====================================================
  // Select Conversation
  // =====================================================

  const handleSelectConversation = async (id: string) => {
    if (!user) {
      setLoginRequired(true);

      return;
    }

    try {
      setConversationId(id);

      setMessages([]);

      setLoginRequired(false);

      const result = await getConversation(id).unwrap();

      const backendMessages = result.data.messages;

      const convertedMessages = backendMessages.map((message) => ({
        id: message._id || `${message.role}-${message.createdAt}`,

        role: message.role,

        content: message.content,
      }));

      setMessages(convertedMessages);

      setSidebarOpen(false);
    } catch (error) {
      console.error("GET CONVERSATION ERROR:", error);
    }
  };

  // =====================================================
  // Delete Conversation
  // =====================================================

  const handleDeleteConversation = async (
    event: React.MouseEvent,
    id: string,
  ) => {
    event.stopPropagation();

    if (!user) {
      setLoginRequired(true);

      return;
    }

    try {
      await deleteConversation(id).unwrap();

      if (conversationId === id) {
        setConversationId(undefined);

        setMessages([]);

        setInput("");
      }

      await refetchConversations();
    } catch (error) {
      console.error("DELETE CONVERSATION ERROR:", error);
    }
  };

  // =====================================================
  // Send Message
  // =====================================================

  const handleSend = async () => {
    const message = input.trim();

    if (!message) {
      return;
    }

    if (isChatLoading) {
      return;
    }

    if (!user) {
      setLoginRequired(true);

      return;
    }

    setLoginRequired(false);

    const userMessage: LocalMessage = {
      id: `user-${Date.now()}`,

      role: "user",

      content: message,
    };

    setMessages((previous) => [...previous, userMessage]);

    setInput("");

    try {
      const response = await ragChat({
        conversationId,
        message,
        limit: 5,
      }).unwrap();

      setConversationId(response.data.conversationId);

      const assistantMessage: LocalMessage = {
        id: `assistant-${Date.now()}`,

        role: "assistant",

        content: response.data.answer,

        restaurants: response.data.restaurants,
      };

      setMessages((previous) => [...previous, assistantMessage]);

      await refetchConversations();
    } catch (error) {
      console.error("RAG CHAT ERROR:", error);

      const errorMessage: LocalMessage = {
        id: `error-${Date.now()}`,

        role: "assistant",

        content: "Sorry, something went wrong. Please try again.",
      };

      setMessages((previous) => [...previous, errorMessage]);
    }
  };

  // =====================================================
  // Handle Enter
  // =====================================================

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSend();
    }
  };

  // =====================================================
  // Login
  // =====================================================

  const handleLogin = () => {
    setOpen(false);

    router.push("/login");
  };

  // =====================================================
  // Conversation Sidebar Content
  // =====================================================

  const conversationSidebar = (
    <Box
      sx={{
        width: {
          xs: 300,
          sm: 240,
        },

        height: "100%",

        backgroundColor: "#FAFAFA",

        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* =================================================
            Sidebar Header
        ================================================= */}

      <Box
        sx={{
          p: 2,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
          }}
        >
          Chats
        </Typography>

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 0.5,
          }}
        >
          <IconButton size="small" onClick={handleNewChat} disabled={!user}>
            <Add />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setSidebarOpen(false)}
            sx={{
              display: {
                xs: "flex",
                sm: "none",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      {/* =================================================
            Guest Sidebar
        ================================================= */}

      {!user ? (
        <Box
          sx={{
            p: 2,

            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,

              lineHeight: 1.7,
            }}
          >
            Login to save and access your conversations.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: "#E85D04",

              "&:hover": {
                backgroundColor: "#D94F00",
              },
            }}
          >
            Login
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,

            minHeight: 0,

            overflowY: "auto",
          }}
        >
          {isConversationsLoading ? (
            <Box
              sx={{
                display: "flex",

                justifyContent: "center",

                py: 3,
              }}
            >
              <CircularProgress size={20} />
            </Box>
          ) : conversations.length === 0 ? (
            <Box
              sx={{
                p: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No conversations yet.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {conversations.map((conversation) => (
                <ListItemButton
                  key={conversation._id}
                  selected={conversationId === conversation._id}
                  onClick={() => handleSelectConversation(conversation._id)}
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 1,

                    py: 1.5,

                    px: 1.5,

                    "&.Mui-selected": {
                      backgroundColor: "#FFF7ED",
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "#FFF1E6",
                    },
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,

                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {conversation.title}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {conversation.messageCount} messages
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    disabled={isDeletingConversation}
                    onClick={(event) =>
                      handleDeleteConversation(event, conversation._id)
                    }
                    sx={{
                      flexShrink: 0,

                      color: "#6B7280",

                      "&:hover": {
                        color: "#D32F2F",
                      },
                    }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );

  // =====================================================
  // Render
  // =====================================================

  return (
    <>
      {/* =================================================
          Floating Button
      ================================================= */}

      {!open && (
        <Tooltip title="AI Restaurant Assistant">
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: "fixed",

              right: {
                xs: 16,
                sm: 24,
              },

              bottom: {
                xs: 16,
                sm: 24,
              },

              width: {
                xs: 52,
                sm: 60,
              },

              height: {
                xs: 52,
                sm: 60,
              },

              zIndex: 2000,

              backgroundColor: "#E85D04",

              color: "#FFFFFF",

              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",

              "&:hover": {
                backgroundColor: "#D94F00",
              },
            }}
          >
            <SmartToy
              sx={{
                fontSize: {
                  xs: 24,
                  sm: 28,
                },
              }}
            />
          </IconButton>
        </Tooltip>
      )}

      {/* =================================================
          Desktop / Tablet Chat Window
      ================================================= */}

      {open && (
        <>
          <Paper
            elevation={12}
            sx={{
              position: "fixed",

              right: {
                xs: 8,
                sm: 16,
                md: 24,
              },

              bottom: {
                xs: 8,
                sm: 16,
                md: 24,
              },

              width: {
                xs: "calc(100vw - 16px)",
                sm: "calc(100vw - 32px)",
                md: 850,
              },

              height: {
                xs: "calc(100dvh - 16px)",
                sm: 600,
                md: 650,
              },

              maxWidth: {
                md: "850px",
              },

              maxHeight: {
                xs: "calc(100dvh - 16px)",
                sm: "calc(100vh - 32px)",
                md: 650,
              },

              zIndex: 2000,

              display: "flex",

              overflow: "hidden",

              borderRadius: {
                xs: 2,
                sm: 3,
              },

              boxSizing: "border-box",
            }}
          >
            {/* =================================================
                Desktop Sidebar
            ================================================= */}

            <Box
              sx={{
                width: 240,

                flexShrink: 0,

                backgroundColor: "#FAFAFA",

                borderRight: "1px solid #E5E7EB",

                display: {
                  xs: "none",
                  sm: "flex",
                },

                flexDirection: "column",

                minHeight: 0,
              }}
            >
              {conversationSidebar}
            </Box>

            {/* =================================================
                Main Chat
            ================================================= */}

            <Box
              sx={{
                flex: 1,

                minWidth: 0,

                minHeight: 0,

                display: "flex",

                flexDirection: "column",
              }}
            >
              {/* =================================================
                  Header
              ================================================= */}

              <Box
                sx={{
                  p: {
                    xs: 1.25,
                    sm: 2,
                  },

                  borderBottom: "1px solid #E5E7EB",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: 1,

                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: {
                      xs: 0.75,
                      sm: 1,
                    },

                    minWidth: 0,
                  }}
                >
                  {/* Mobile Chats */}

                  {user && (
                    <IconButton
                      size="small"
                      onClick={() => setSidebarOpen(true)}
                      sx={{
                        display: {
                          xs: "flex",
                          sm: "none",
                        },

                        flexShrink: 0,
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}

                  <SmartToy
                    sx={{
                      color: "#E85D04",

                      fontSize: {
                        xs: 24,
                        sm: 28,
                      },

                      flexShrink: 0,
                    }}
                  />

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,

                        fontSize: {
                          xs: 14,
                          sm: 16,
                        },

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      Restaurant Assistant
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    >
                      Ask me anything about restaurants
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 0.5,

                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleNewChat}
                    disabled={!user}
                  >
                    <Add />
                  </IconButton>

                  <IconButton size="small" onClick={() => setOpen(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </Box>

              {/* =================================================
                  Messages
              ================================================= */}

              <Box
                sx={{
                  flex: 1,

                  minHeight: 0,

                  minWidth: 0,

                  overflowY: "auto",

                  overflowX: "hidden",

                  p: {
                    xs: 1.25,
                    sm: 2,
                  },

                  backgroundColor: "#F9FAFB",
                }}
              >
                {/* =================================================
                    Guest
                ================================================= */}

                {!user && (
                  <Box
                    sx={{
                      minHeight: "100%",

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "center",

                      textAlign: "center",

                      px: {
                        xs: 2,
                        sm: 3,
                      },
                    }}
                  >
                    <SmartToy
                      sx={{
                        fontSize: {
                          xs: 50,
                          sm: 60,
                        },

                        color: "#E85D04",

                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,

                        mb: 1,
                      }}
                    >
                      Restaurant Assistant
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mb: 2,

                        maxWidth: 450,

                        lineHeight: 1.7,
                      }}
                    >
                      Login to start a conversation and save your chat history.
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={handleLogin}
                      sx={{
                        backgroundColor: "#E85D04",

                        "&:hover": {
                          backgroundColor: "#D94F00",
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                )}

                {/* =================================================
                    Conversation Loading
                ================================================= */}

                {user && isConversationFetching && (
                  <Box
                    sx={{
                      display: "flex",

                      justifyContent: "center",

                      py: 4,
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                )}

                {/* =================================================
                    Empty State
                ================================================= */}

                {user &&
                  !isConversationFetching &&
                  !conversationId &&
                  messages.length === 0 && (
                    <Box
                      sx={{
                        minHeight: "100%",

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        textAlign: "center",

                        px: {
                          xs: 2,
                          sm: 3,
                        },
                      }}
                    >
                      <SmartToy
                        sx={{
                          fontSize: {
                            xs: 50,
                            sm: 60,
                          },

                          color: "#E85D04",

                          mb: 2,
                        }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,

                          mb: 1,
                        }}
                      >
                        Hi! I&apos;m your restaurant assistant.
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          maxWidth: 500,

                          lineHeight: 1.7,
                        }}
                      >
                        Ask me for restaurants, cuisines, areas, ratings, or
                        recommendations.
                      </Typography>
                    </Box>
                  )}

                {/* =================================================
                    Messages
                ================================================= */}

                {user &&
                  !isConversationFetching &&
                  messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        mb: 2,

                        display: "flex",

                        justifyContent:
                          message.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: "fit-content",

                          maxWidth: {
                            xs: "92%",
                            sm: "85%",
                            md: "75%",
                          },

                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",

                            alignItems: "flex-start",

                            gap: {
                              xs: 0.5,
                              sm: 1,
                            },
                          }}
                        >
                          {message.role === "assistant" && (
                            <SmartToy
                              sx={{
                                mt: 1,

                                fontSize: {
                                  xs: 18,
                                  sm: 20,
                                },

                                color: "#E85D04",

                                flexShrink: 0,
                              }}
                            />
                          )}

                          <Box
                            sx={{
                              p: {
                                xs: 1.25,
                                sm: 1.5,
                              },

                              borderRadius: 2,

                              backgroundColor:
                                message.role === "user" ? "#E85D04" : "#FFFFFF",

                              color:
                                message.role === "user"
                                  ? "#FFFFFF"
                                  : "text.primary",

                              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",

                              whiteSpace: "pre-wrap",

                              overflowWrap: "anywhere",

                              wordBreak: "break-word",

                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                lineHeight: 1.7,

                                fontSize: {
                                  xs: 13,
                                  sm: 14,
                                },

                                overflowWrap: "anywhere",
                              }}
                            >
                              {message.content}
                            </Typography>
                          </Box>

                          {message.role === "user" && (
                            <Person
                              sx={{
                                mt: 1,

                                fontSize: {
                                  xs: 18,
                                  sm: 20,
                                },

                                color: "#666",

                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>

                        {/* =================================================
                              Restaurant Results
                          ================================================= */}

                        {message.role === "assistant" &&
                          message.restaurants &&
                          message.restaurants.length > 0 && (
                            <Box
                              sx={{
                                mt: 1.5,

                                ml: {
                                  xs: 0,
                                  sm: 3,
                                },

                                width: {
                                  xs: "100%",
                                  sm: "calc(100% - 24px)",
                                },
                              }}
                            >
                              {message.restaurants.map((restaurant) => (
                                <Paper
                                  key={restaurant._id}
                                  sx={{
                                    p: {
                                      xs: 1,
                                      sm: 1.5,
                                    },

                                    mb: 1,

                                    display: "flex",

                                    alignItems: "center",

                                    gap: {
                                      xs: 1,
                                      sm: 1.5,
                                    },

                                    borderRadius: 2,

                                    minWidth: 0,
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={
                                      restaurant.image ||
                                      "/images/restaurant-placeholder.jpg"
                                    }
                                    alt={restaurant.name}
                                    sx={{
                                      width: {
                                        xs: 45,
                                        sm: 55,
                                      },

                                      height: {
                                        xs: 45,
                                        sm: 55,
                                      },

                                      borderRadius: 2,

                                      objectFit: "cover",

                                      flexShrink: 0,
                                    }}
                                  />

                                  <Box
                                    sx={{
                                      minWidth: 0,

                                      flex: 1,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: 700,

                                        fontSize: {
                                          xs: 13,
                                          sm: 14,
                                        },

                                        overflow: "hidden",

                                        textOverflow: "ellipsis",

                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {restaurant.name}
                                    </Typography>

                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        display: "block",

                                        overflow: "hidden",

                                        textOverflow: "ellipsis",

                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {restaurant.cuisine} • {restaurant.area}
                                    </Typography>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",

                                        color: "#E85D04",

                                        fontWeight: 700,
                                      }}
                                    >
                                      ★{" "}
                                      {typeof restaurant.rating === "number"
                                        ? restaurant.rating.toFixed(1)
                                        : "0.0"}
                                    </Typography>
                                  </Box>
                                </Paper>
                              ))}
                            </Box>
                          )}
                      </Box>
                    </Box>
                  ))}

                {/* =================================================
                    Sending
                ================================================= */}

                {user && isChatLoading && (
                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      gap: 1,

                      mb: 2,
                    }}
                  >
                    <SmartToy
                      sx={{
                        fontSize: 20,

                        color: "#E85D04",
                      }}
                    />

                    <Box
                      sx={{
                        p: 1.5,

                        borderRadius: 2,

                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <CircularProgress size={18} />
                    </Box>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* =================================================
                  Login Required
              ================================================= */}

              {!user && loginRequired && (
                <Box
                  sx={{
                    p: {
                      xs: 1.25,
                      sm: 2,
                    },

                    backgroundColor: "#FFF7ED",

                    borderTop: "1px solid #FED7AA",

                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                    }}
                  >
                    Please login to start a conversation.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    size="small"
                    sx={{
                      backgroundColor: "#E85D04",

                      "&:hover": {
                        backgroundColor: "#D94F00",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              )}

              {/* =================================================
                  Input
              ================================================= */}

              <Box
                sx={{
                  p: {
                    xs: 1,
                    sm: 2,
                  },

                  borderTop: "1px solid #E5E7EB",

                  backgroundColor: "#FFFFFF",

                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    gap: 0.75,

                    alignItems: "flex-end",

                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      user
                        ? "Ask about restaurants..."
                        : "Login to start chatting..."
                    }
                    disabled={!user || isChatLoading}
                    sx={{
                      minWidth: 0,

                      "& .MuiInputBase-root": {
                        fontSize: {
                          xs: 14,
                          sm: 16,
                        },
                      },
                    }}
                  />

                  <IconButton
                    onClick={handleSend}
                    disabled={!user || !input.trim() || isChatLoading}
                    sx={{
                      width: {
                        xs: 44,
                        sm: 48,
                      },

                      height: {
                        xs: 44,
                        sm: 48,
                      },

                      flexShrink: 0,

                      backgroundColor: "#E85D04",

                      color: "#FFFFFF",

                      "&:hover": {
                        backgroundColor: "#D94F00",
                      },

                      "&.Mui-disabled": {
                        backgroundColor: "#E5E7EB",
                      },
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },

                    mt: 0.75,
                  }}
                >
                  Press Enter to send. Shift + Enter for a new line.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* =================================================
              Mobile Conversations Drawer
          ================================================= */}

          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
              zIndex: 2100,

              display: {
                xs: "block",
                sm: "none",
              },

              "& .MuiDrawer-paper": {
                width: 300,

                maxWidth: "85vw",

                boxSizing: "border-box",
              },
            }}
          >
            {conversationSidebar}
          </Drawer>
        </>
      )}
    </>
  );
}
