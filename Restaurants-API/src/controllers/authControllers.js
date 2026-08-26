const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const sendResponse = require("../utils/response");

const generateOTP = require("../utils/generateOTP");

const sendOTPEmail = require("../utils/sendEmail");

// =====================================================
// Register
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // =====================================================
    // Validation
    // =====================================================

    if (!name || !email || !password) {
      return sendResponse(
        res,
        400,
        false,
        "Please provide all required fields",
        null,
      );
    }

    // =====================================================
    // Check Existing User
    // =====================================================

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return sendResponse(res, 400, false, "Email already exists", null);
    }

    // =====================================================
    // Create User
    // =====================================================

    const user = await User.create({
      name,
      email,
      password,

      // Never trust role from frontend
      role: "user",
    });

    // =====================================================
    // Generate OTP
    // =====================================================

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // =====================================================
    // Send OTP
    // =====================================================

    await sendOTPEmail(user.email, otp);

    // =====================================================
    // Response
    // =====================================================

    return sendResponse(
      res,
      201,
      true,
      "Registration successful. OTP sent to your email.",
      {
        user: {
          id: user._id,

          name: user.name,

          email: user.email,

          role: user.role,

          isVerified: user.isVerified,

          favorites: user.favorites || [],
        },
      },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return sendResponse(res, 500, false, error.message, null);
  }
};

// =====================================================
// Login
// =====================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =====================================================
    // Validation
    // =====================================================

    if (!email || !password) {
      return sendResponse(
        res,
        400,
        false,
        "Please provide all required fields",
        null,
      );
    }

    // =====================================================
    // Find User
    // =====================================================

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return sendResponse(res, 400, false, "Invalid credentials", null);
    }

    // =====================================================
    // Compare Password
    // =====================================================

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid email or password", null);
    }

    // =====================================================
    // Generate Token
    // =====================================================

    const token = generateToken(user._id);

    // =====================================================
    // Response
    // =====================================================

    return sendResponse(res, 200, true, "Login successful", {
      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role || "user",

        isVerified: user.isVerified,

        favorites: user.favorites || [],
      },

      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return sendResponse(res, 500, false, error.message, null);
  }
};

// =====================================================
// Verify OTP
// =====================================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // =====================================================
    // Validation
    // =====================================================

    if (!email || !otp) {
      return sendResponse(res, 400, false, "Email and OTP are required", null);
    }

    // =====================================================
    // Find User
    // =====================================================

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return sendResponse(res, 404, false, "User not found", null);
    }

    // =====================================================
    // Check OTP
    // =====================================================

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return sendResponse(res, 400, false, "OTP has expired", null);
    }

    // =====================================================
    // Compare OTP
    // =====================================================

    if (user.otp !== otp) {
      return sendResponse(res, 400, false, "Invalid OTP", null);
    }

    // =====================================================
    // Verify User
    // =====================================================

    user.isVerified = true;

    user.otp = null;

    user.otpExpires = null;

    await user.save();

    // =====================================================
    // Return User
    // =====================================================

    return sendResponse(res, 200, true, "Email verified successfully", {
      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role || "user",

        isVerified: user.isVerified,

        favorites: user.favorites || [],
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return sendResponse(res, 500, false, error.message, null);
  }
};

// =====================================================
// Resend OTP
// =====================================================

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // =====================================================
    // Validation
    // =====================================================

    if (!email) {
      return sendResponse(res, 400, false, "Email is required", null);
    }

    // =====================================================
    // Find User
    // =====================================================

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return sendResponse(res, 404, false, "User not found", null);
    }

    // =====================================================
    // Already Verified
    // =====================================================

    if (user.isVerified) {
      return sendResponse(res, 400, false, "Email is already verified", null);
    }

    // =====================================================
    // Generate New OTP
    // =====================================================

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // =====================================================
    // Send Email
    // =====================================================

    await sendOTPEmail(user.email, otp);

    // =====================================================
    // Response
    // =====================================================

    return sendResponse(res, 200, true, "OTP resent successfully", {
      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role || "user",

        isVerified: user.isVerified,

        favorites: user.favorites || [],
      },
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return sendResponse(res, 500, false, error.message, null);
  }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
};
