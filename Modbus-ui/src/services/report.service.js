import * as XLSX from "xlsx";
import dayjs from "dayjs";

class ReportService {

    downloadExcel(history) {
        console.log("current history", history)

        if (!history.length) {

            alert("No records found.");

            return;

        }

        const excelData = history.map((row) => ({

            "Date": dayjs(row.timestamp).format("DD MMM YYYY"),

            "Time": dayjs(row.timestamp).format("hh:mm:ss A"),

            "Power": row.power,

            "Speed (RPM)": row.speed,

            "Temperature (°C)": row.temperature,

            "Current (A)": row.current,

            "Voltage (V)": row.voltage,

            "Torque": row.torque,

            "Alarm": row.alarm ? "YES" : "NO"

        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "View & download operational history"

        );

        XLSX.writeFile(

            workbook,

            `Machine_Report_${dayjs().format("DD-MM-YYYY_HH-mm")}.xlsx`

        );

    }

}

export default new ReportService();