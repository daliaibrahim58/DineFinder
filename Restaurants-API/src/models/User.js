const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // Name
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // Email
    // =====================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // Password
    // =====================================================

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // =====================================================
    // Role
    // =====================================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =====================================================
    // Email Verification
    // =====================================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // OTP
    // =====================================================

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    // =====================================================
    // Favorites
    // =====================================================

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// =====================================================
// Hash Password
// =====================================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// =====================================================
// Compare Password
// =====================================================

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// =====================================================
// Model
// =====================================================

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
