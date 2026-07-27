import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { formatPipeLength } from "../helpers/helpers";

class ReportService {

    downloadExcel(history) {


        if (!history || !history.length) {

            alert("No records found.");

            return;

        }

        const excelData =[...history].reverse().map((row, index) => ({

            "Sr No": index + 1,

            "Date": dayjs(row.timestamp).format("DD MMM YYYY"),

            "Time": dayjs(row.timestamp).format("hh:mm:ss A"),

            "Motor Status": row.motorStatus,

            "Motor RPM": row.motorRPM,

            "Pipe Length (m/min)": formatPipeLength(row.pipeLength)

        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        worksheet["!cols"] = [

            { wch: 8 },

            { wch: 18 },

            { wch: 18 },

            { wch: 18 },

            { wch: 18 },

            { wch: 20 }

        ];

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Operational History"

        );

        XLSX.writeFile(

            workbook,

            `Operational_History_${dayjs().format("DD-MM-YYYY_HH-mm")}.xlsx`

        );

    }

}

export default new ReportService();