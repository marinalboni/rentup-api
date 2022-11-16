const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ROUNDS = 10;

const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required."],
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [EMAIL_PATTERN, "Email is not valid."],
      trim: true,
      lowercase: true,
      unique: [
        true,
        "This email is already in use. Please, choose another one.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    image: {
      type: String,
      default:
        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
    },
    type: {
      type: String,
      enum: ["tenant", "tenant&owner"],
      required: true,
      default: "tenant",
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    googleID: {
      type: String,
    },
    activationToken: {
      type: String,
      default: () => {
        return Math.random().toString(36).substring(7);
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        delete ret.password;

        return ret;
      },
    },
  }
);

UserSchema.virtual("property", {
    ref: "Property",
    localField: "_id",
    foreignField: "owner",
    justOne: true,
});

UserSchema.virtual("favorite", {
  ref: "Favorite",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("rent", {
  ref: "Rent",
  localField: "_id",
  foreignField: "userWhoRents",
  justOne: true,
});

UserSchema.virtual("reservation", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("notification", {
  ref: "Notification",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "sender",
  justOne: true,
});

UserSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "receiver",
  justOne: true,
});

UserSchema.virtual("prequalification", {
  ref: "Prequalification",
  localField: "_id",
  foreignField: "tenant",
  justOne: true,
});

UserSchema.virtual("visit", {
  ref: "Visit",
  localField: "_id",
  foreignField: "userWhoVisits",
  justOne: true,
});

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, ROUNDS)
      .then((hash) => {
        this.password = hash;
        next()
      })
  } else {
    next()
  }
})

UserSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;