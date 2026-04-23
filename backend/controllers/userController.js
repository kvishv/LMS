import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
             res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status (Suspend/Activate)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = user.status === 'Active' ? 'Suspended' : 'Active';
            const updatedUser = await user.save();
            res.json({
                 _id: updatedUser._id,
                 fullName: updatedUser.fullName,
                 email: updatedUser.email,
                 role: updatedUser.role,
                 status: updatedUser.status
            });
        } else {
             res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role (User/Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
             user.role = user.role === 'User' ? 'Admin' : 'User';
             const updatedUser = await user.save();
             res.json({
                  _id: updatedUser._id,
                  fullName: updatedUser.fullName,
                  email: updatedUser.email,
                  role: updatedUser.role,
                  status: updatedUser.status
             });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
             res.json({ message: 'User removed successfully' });
        } else {
             res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};
