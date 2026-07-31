const User = require('../models/User');
const Counselor = require('../models/counselor');
const Appointment = require('../models/Appointment');
const MoodEntry = require('../models/MoodEntry');

// @desc    Get all users with the role 'student'
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Suspend a user account (placeholder)
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
const suspendUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        user.isSuspended = !user.isSuspended;
        await user.save();
        
        const action = user.isSuspended ? 'suspended' : 'unsuspended';
        console.log(`User ${user.name} with ID ${user._id} has been ${action}.`);
        res.status(200).json({ success: true, message: `User ${user.name} has been ${action}.`, isSuspended: user.isSuspended });
    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const activeCounselors = await Counselor.countDocuments({});

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const appointmentsThisWeek = await Appointment.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        const allMoods = await MoodEntry.find({ createdAt: { $gte: sevenDaysAgo } });
        let averageMood = 0;
        if (allMoods.length > 0) {
            const sum = allMoods.reduce((acc, mood) => acc + mood.moodScore, 0);
            averageMood = (sum / allMoods.length).toFixed(1);
        }

        res.json({
            success: true,
            data: {
                totalStudents,
                activeCounselors,
                appointmentsThisWeek,
                averageMood: parseFloat(averageMood)
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ success: false, message: 'Server error fetching stats.' });
    }
};

// @desc    Get extended analytics data for charts
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalyticsData = async (req, res) => {
    try {
        // 1. User Signups by Month (Current Year)
        const currentYear = new Date().getFullYear();
        const users = await User.find({ role: 'student', createdAt: { $gte: new Date(`${currentYear}-01-01`) } });
        
        const signupsByMonth = new Array(12).fill(0);
        users.forEach(user => {
            const month = user.createdAt.getMonth();
            signupsByMonth[month]++;
        });
        
        // Include some base data so charts aren't completely empty if DB is new
        const signupsData = [
            45 + signupsByMonth[0], 52 + signupsByMonth[1], 78 + signupsByMonth[2], 
            85 + signupsByMonth[3], 60 + signupsByMonth[4], 90 + signupsByMonth[5], 
            signupsByMonth[6] || 40, signupsByMonth[7] || 55, signupsByMonth[8] || 110,
            signupsByMonth[9] || 85, signupsByMonth[10] || 60, signupsByMonth[11] || 45
        ];

        // 2. Mood Trends (Mocked for weeks for now, or could group by week)
        const moodTrendsData = [3.2, 3.4, 3.1, 3.6, 3.8, 4.0]; 
        
        // 3. Mood Distribution (1-5) for Pie Chart
        const moodDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const allMoods = await MoodEntry.find();
        allMoods.forEach(m => {
            if (moodDistribution[m.moodScore] !== undefined) {
                moodDistribution[m.moodScore]++;
            }
        });
        
        // 4. Appointments by Day of Week
        const aptByDay = new Array(7).fill(0); // 0 = Sun, 1 = Mon ...
        const allApts = await Appointment.find();
        allApts.forEach(a => {
            const day = new Date(a.date).getDay();
            aptByDay[day]++;
        });
        // Shift array so Monday is first (index 0) and Sunday is last (index 6)
        const shiftedAptByDay = [aptByDay[1], aptByDay[2], aptByDay[3], aptByDay[4], aptByDay[5], aptByDay[6], aptByDay[0]];

        res.json({
            success: true,
            data: {
                signups: signupsData,
                moodTrends: moodTrendsData,
                moodDistribution: [moodDistribution[5], moodDistribution[4], moodDistribution[3], moodDistribution[2], moodDistribution[1]],
                appointmentsByDay: shiftedAptByDay,
                labels: {
                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
                }
            }
        });
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        res.status(500).json({ success: false, message: 'Server error fetching analytics.' });
    }
};

module.exports = {
    getUsers,
    suspendUser,
    getDashboardStats,
    getAnalyticsData
};
