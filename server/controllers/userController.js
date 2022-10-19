const Users = require("../models/User");
const {
    validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../middlewares/jwt");

class User {
    UserRegistration = async (req, res) => {
        const {
            name,
            email,
            password,
            confirmPassword,
            role
        } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                errors: errors.array(),
            });
        }
        try {
            let emailExist;
            emailExist = await Users.findOne({
                email: email,
            });
            if (emailExist) {
                return res.status(409).send({
                    message: "Email already exist",
                });
            } else if (password !== confirmPassword) {
                return res.status(409).send({
                    message: "Password and confirm password dont match",
                });
            } else {
                let salt = await bcrypt.genSalt(10); //round 10 out of total 12 round
                let encryptedPassword = await bcrypt.hash(password, salt);
                const user = await new Users({
                    ...req.body,
                    password: encryptedPassword,
                    confirmPassword: encryptedPassword,
                });
                await user.save();
                return res.status(200).send({
                    message: "User registered successfully",
                    data: user,
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: "Service error",
                error: err,
            });
        }
    };

    UserLogin = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        try {
            let user;
            user = await Users.findOne({
                email: email,
            });
            if (!user) {
                return res.status(204).send({
                    message: "Invalid Email",
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(205).send({
                    message: "Invalid Password",
                });
            }
            const token = jwtHelper.issue({
                id: user._id,
                role: user.role
            });
            return res.status(200).send({
                message: "Login successfull",
                token,
                data: user,
            });
        } catch (error) {
            return res.status(500).send({
                message: "The server error",
            });
        }
    };

    AdminLogin = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        try {
            let user = await Users.findOne({
                email
            });
            if (!user) {
                return res.status(404).send({
                    message: "Invalid Credientals",
                });
            }
            if (user.role != "admin") {
                return res.status(404).send({
                    message: "You can't access Admin Panel",
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send({
                    message: "Invalid Credientals",
                });
            }
            const token = jwtHelper.issue({
                id: user._id,
                role: user.role
            });
            return res.status(200).send({
                message: "Login successfull",
                token,
                data: user,
            });
        } catch (err) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };

    GetAllUsers = async (req, res) => {
        const specficUser = req.userId;
        try {
            let allUsers = await Users.find()
                .sort({
                    _id: -1
                })
                .select("_id name email role status");
            if (allUsers.length < 0) {
                return res.status.send({
                    message: "No User Found",
                    data: [],
                });
            }
            const foundedUser = await Users.findOne({
                specficUser
            });
            return res.status(200).send({
                message: "Users found successfully",
                data: allUsers,
                foundedUser,
            });
        } catch (err) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };

    GetUserById = async (req, res) => {
        try {
            let user = await Users.findOne({
                _id: req.params.id
            }).select(
                "-_id name email role"
            );
            if (!user) {
                return res.status(404).send({
                    message: "The User Not Found",
                });
            }
            return res.status(200).send({
                message: "User found successfully",
                data: user,
            });
        } catch (error) {
            return res.status(500).send({
                message: "Error of server",
            });
        }
    };

    RemoveUserById = async (req, res) => {
        try {
            let user = await Users.findOneAndDelete({
                _id: req.params.id,
            });
            if (!user) {
                return res.status(400).send({
                    message: "User not found",
                });
            }
            return res.status(200).send({
                message: "User deleted successfully",
                data: user,
            });
        } catch (error) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };

    UpdateUserById = async (req, res) => {
        const {
            name,
            email,
            password,
            confirmPassword,
            role
        } = req.body;
        let salt = await bcrypt.genSalt(10); //round 10 out of total 12 round
        let encryptedPassword = await bcrypt.hash(password, salt);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                errors: errors.array(),
            });
        }
        try {
            let user = await Users.findOneAndUpdate({
                _id: req.params.id
            }, {
                password: encryptedPassword,
                confirmPassword: encryptedPassword,
                ...req.body,
            });
            if (!user) {
                return res.status(404).send({
                    message: "The User not found and not updated",
                });
            }
            return res.status(200).send({
                message: "user updated successfully",
                data: user,
            });
        } catch (error) {
            return res.status(500).send({
                message: "Server error",
            });
        }
    };

    ChangeStatus = async (req, res) => {
        const {
            newstatus
        } = req.body;
        const {
            id
        } = req.params;
        try {
            const approvedAccount = await Users.findOneAndUpdate({
                _id: id
            }, {
                status: newstatus,
            }, {
                new: true
            });
            if (!approvedAccount) {
                return res.status(404).send({
                    message: "No account found",
                    data: [],
                });
            } else {
                return res.status(200).send({
                    message: "Account has been approved",
                    data: approvedAccount,
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };

    ApproveUser = async (req, res) => {
        const {
            id
        } = req.params;
        try {
            const approvedAccount = await Users.findOneAndUpdate({
                _id: id
            }, {
                status: "Active"
            }, {
                new: true
            });
            if (!approvedAccount) {
                return res.status(404).send({
                    message: "No account found",
                    data: [],
                });
            } else {
                return res.status(200).send({
                    message: "Account has been approved",
                    data: approvedAccount,
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };

    UnApproveUser = async (req, res) => {
        const {
            id
        } = req.params;
        try {
            const approvedAccount = await Users.findOneAndUpdate({
                _id: id
            }, {
                status: "De Active"
            }, {
                new: true
            });
            if (!approvedAccount) {
                return res.status(404).send({
                    message: "No account found",
                    data: [],
                });
            } else {
                return res.status(200).send({
                    message: "Account has been approved",
                    data: approvedAccount,
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };

    SearchUser = async (req, res) => {
        try {
            let searchedName = await Users.find({
                $or: [{
                    name: {
                        $regex: req.params.name,
                        $options: "i"
                    }
                }],
            });
            return res.status(200).send({
                data: searchedName,
                message: "The user searched",
            });
        } catch (err) {
            return res.status(500).send({
                message: "Server Error",
            });
        }
    };
}

module.exports = new User();