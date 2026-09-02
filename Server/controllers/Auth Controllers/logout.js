import UserModel from "../../models/userModel.js";

const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "User ID is invalid.",
      });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    user.refreshTokens = [];
    await user.save();
    return res.status(200).json({
      success: true,
      message: "You have been logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "We could not log you out right now. Please try again.",
    });
  }
};

export default logout;
