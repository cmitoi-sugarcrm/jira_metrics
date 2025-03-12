db = db.getSiblingDB("jira_metrics");

// Check if the collection already exists
if (db.periods.countDocuments({}) === 0) {
    db.periods.insertMany([
        { name: "13.0.0", startDate: new Date("2023-02-03"), endDate: new Date("2023-03-17") },
        { name: "13.1.0", startDate: new Date("2023-05-16"), endDate: new Date("2023-06-27") },
        { name: "13.2.0", startDate: new Date("2023-08-07"), endDate: new Date("2023-09-19") },
        { name: "13.3.0", startDate: new Date("2023-11-15"), endDate: new Date("2023-12-27") },
        { name: "14.0.0", startDate: new Date("2024-02-02"), endDate: new Date("2024-03-21") },
        { name: "14.1.0", startDate: new Date("2024-05-09"), endDate: new Date("2024-06-21") },
        { name: "14.2.0", startDate: new Date("2024-08-01"), endDate: new Date("2024-09-18") },
        { name: "25.1.0-alpha", startDate: new Date("2024-11-07"), endDate: new Date("2024-12-09") },
        { name: "25.1.0", startDate: new Date("2025-02-07"), endDate: new Date("2025-03-21") }
    ]);

    print("✅ MongoDB initialization script executed successfully!");
} else {
    print("⚠️ MongoDB already contains periods. Skipping initialization.");
}
