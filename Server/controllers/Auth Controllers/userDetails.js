import UserModel from "../../models/userModel.js";

const userDetails = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const userData = {
      username: user.username,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
      createdAt: user.createdAt,
    };
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "We could not fetch user details right now. Please try again.",
    });
  }
};

export default userDetails;
