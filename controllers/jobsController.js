const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const { data, error } = await supabase.from("jobs").select("*");
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllJobs, getJobById };
