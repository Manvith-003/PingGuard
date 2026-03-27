const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePDF = (sites) => {
    return new Promise((resolve) => {
        const filePath = "report.pdf";
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            bufferPages: true
        });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // 🔹 Branding Header
        // Add a dark background for the header
        doc.rect(0, 0, doc.page.width, 100).fill("#030712");

        // Logo text
        doc.fillColor("#3b82f6").fontSize(24).font("Helvetica-Bold")
            .text("PingGuard", 50, 40);

        // Subtitle
        doc.fillColor("#ffffff").fontSize(10).font("Helvetica")
            .text("Service Monitoring Report", 50, 68);

        // Date & Time
        const now = new Date();
        doc.fillColor("#94a3b8").fontSize(10)
            .text(now.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }), 50, 45, { align: "right" });

        doc.moveDown(4);

        // 🔹 Summary Section
        const stats = {
            total: sites.length,
            up: sites.filter(s => s.status === "UP").length,
            down: sites.filter(s => s.status === "DOWN").length
        };

        let summaryY = 125;

        // Light background for summary box
        doc.roundedRect(50, summaryY, 495, 70, 8).fill("#f8fafc");
        doc.lineWidth(1).strokeColor("#e2e8f0").stroke();

        // Stats Content
        doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold");
        doc.text("TOTAL SERVICES", 75, summaryY + 20);
        doc.text("OPERATIONAL", 235, summaryY + 20);
        doc.text("OUTAGES", 395, summaryY + 20);

        doc.fillColor("#0f172a").fontSize(20).font("Helvetica-Bold");
        doc.text(stats.total.toString(), 75, summaryY + 35);

        doc.fillColor("#10b981").text(stats.up.toString(), 235, summaryY + 35);

        doc.fillColor("#ef4444").text(stats.down.toString(), 395, summaryY + 35);

        doc.moveDown(3.5);

        // 🔹 Monitors Table
        let y = 220;
        const startX = 50;
        const colWidths = {
            name: 130,
            url: 180,
            status: 90,
            response: 95
        };

        // Table Header Background
        doc.rect(startX, y, 495, 25).fill("#1e293b");
        doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");

        const headerRowY = y + 8;
        doc.text("NAME", startX + 12, headerRowY);
        doc.text("URL", startX + colWidths.name + 12, headerRowY);
        doc.text("STATUS", startX + colWidths.name + colWidths.url + 12, headerRowY);
        doc.text("LATENCY", startX + colWidths.name + colWidths.url + colWidths.status + 12, headerRowY);

        y += 25;

        // 🔹 Table Rows
        doc.font("Helvetica");

        sites.forEach((site, index) => {
            // Check for page break BEFORE drawing the row background
            if (y > 720) {
                doc.addPage();
                y = 50;

                // Re-draw header on new page
                doc.rect(startX, y, 495, 25).fill("#1e293b");
                doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");
                doc.text("NAME", startX + 12, y + 8);
                doc.text("URL", startX + colWidths.name + 12, y + 8);
                doc.text("STATUS", startX + colWidths.name + colWidths.url + 12, y + 8);
                doc.text("LATENCY", startX + colWidths.name + colWidths.url + colWidths.status + 12, y + 8);
                y += 25;
            }

            // Alternating row background
            if (index % 2 === 0) {
                doc.rect(startX, y, 495, 32).fill("#ffffff");
            } else {
                doc.rect(startX, y, 495, 32).fill("#f8fafc");
            }

            const rowTextY = y + 11;

            // 1. Name
            doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold")
                .text(site.name || "Unnamed", startX + 12, rowTextY, {
                    width: colWidths.name - 15,
                    ellipsis: true
                });

            // 2. URL
            doc.fillColor("#64748b").fontSize(8).font("Helvetica")
                .text(site.url || "-", startX + colWidths.name + 12, rowTextY + 1, {
                    width: colWidths.url - 15,
                    ellipsis: true
                });

            // 3. Status Badge
            const statusX = startX + colWidths.name + colWidths.url + 12;
            if (site.status === "UP") {
                doc.fillColor("#10b981").font("Helvetica-Bold").fontSize(9).text("OPERATIONAL", statusX, rowTextY);
            } else {
                doc.fillColor("#ef4444").font("Helvetica-Bold").fontSize(9).text("DOWN", statusX, rowTextY);
            }

            // 4. Response Time
            doc.fillColor("#334155").font("Helvetica").fontSize(9).text(
                site.responseTime ? `${site.responseTime} ms` : "--",
                startX + colWidths.name + colWidths.url + colWidths.status + 12,
                rowTextY
            );

            // Row separator line
            doc.moveTo(startX, y + 32).lineTo(startX + 495, y + 32).strokeColor("#f1f5f9").lineWidth(0.5).stroke();

            y += 32;
        });

        // 🔹 Add Footer with Page Numbers
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.moveTo(50, 780).lineTo(545, 780).strokeColor("#e2e8f0").stroke();
            doc.fillColor("#94a3b8").fontSize(8)
                .text(`Page ${i + 1} of ${pages.count} • PingGuard Security Monitor`, 50, 788, { align: "center" });
        }

        doc.end();

        stream.on("finish", () => {
            resolve(filePath);
        });

        stream.on("error", (err) => {
            console.error("PDF Stream Error:", err);
        });
    });
};

module.exports = generatePDF;