const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number }
  },
  { timestamps: true }
);

RatingSchema.pre("save", async function(next) {
  try {
    const user = await mongoose.model("user").findOne({ _id: this.owner });
    if (user && !user.ratings.includes(this._id)) {
      await user.update({ ratings: { $push: this._id } });
    }
  } catch (error) {
    console.error(error);
  }
  next();
});

RatingSchema.pre("remove", async function(next) {
  try {
    await mongoose
      .model("user")
      .update(
        { recipes: { $inc: this._id } },
        { recipes: { $pull: this._id } }
      );
  } catch (error) {
    console.error(error);
  }
  next();
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
