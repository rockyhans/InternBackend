const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/fetchUser");

router.post("/", auth, async (req, res) => {
  const { company, role, status, date, link } = req.body;
  const userId = req.user.id;

  try {
    const job = await Job.create({
      company,
      role,
      status,
      date,
      link,
      user: userId,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET:
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
