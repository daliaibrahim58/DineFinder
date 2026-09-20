```tsx
import {
  Box,
  Container,
  Typography,
  Divider,
} from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        backgroundColor: "#1F2937",
        color: "#FFFFFF",
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                mb: 1,
                fontWeight: 800,
              }}
            >
              DineFinder
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#D1D5DB",
                maxWidth: 350,
              }}
            >
              Discover great restaurants,
              explore new cuisines, and
              find your next favorite place
              to eat.
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Explore
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#D1D5DB",
              }}
            >
              Restaurants
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#D1D5DB",
                mt: 1,
              }}
            >
              Favorites
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Contact
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#D1D5DB",
              }}
            >
              support@dinefinder.com
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            my: 4,
            borderColor: "rgba(255,255,255,0.15)",
          }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#9CA3AF",
          }}
        >
          © {new Date().getFullYear()} DineFinder. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
