import writeXlsxFile from "write-excel-file/node"; // https://gitlab.com/catamphetamine/write-excel-file#readme
import { fnReturnExcelFilesFolderPath } from "./file.utils.controller.js";
import logger from "../logs_module/logs.controller.js";
import fs from "fs";

// Test Function Columns Custom
async function fnTestWithDataColumns() {
  const data = [
    [
      {
        value: "Cost",
        fontWeight: "bold",
      },
      {
        value: "Date of Birth",
        fontWeight: "bold",
        fontStyle: "italic",
        height: 48,
      },
      {
        value: "Name",
        fontWeight: "bold",
      },
    ],
    [
      {
        value: 180.0,
        format: "#,##0.00",
        type: Number,
        align: "center",
        fontWeight: "bold",
      },
      {
        value: new Date(),
        type: Date,
        format: "mm/dd/yyyy",
      },
      {
        value: "John Smith",
        type: String,
        backgroundColor: "#FFFF00",
      },
      {
        value: true,
        type: Boolean,
      },
      {
        value: 'HYPERLINK("https://example.com", "A link")',
        type: "Formula",
      },
    ],
    [
      {
        value: 200.5,
        format: "#,##0.00",
        type: Number,
        align: "right",
        alignVertical: "top",
      },
      {
        value: new Date(),
        type: Date,
        format: "mm/dd/yyyy",
        align: "center",
        alignVertical: "bottom",
      },
      {
        value: "Alice Brown\nNew line",
        type: String,
        color: "#ff0000",
        backgroundColor: "#eeeeee",
        align: "left",
        wrap: true,
      },
      {
        value: false,
        type: Boolean,
        alignVertical: "center",
      },
      {
        value: 'HYPERLINK("https://google.com", "Google.com")',
        type: "Formula",
        indent: 2,
      },
    ],
  ];

  const columns = [
    {},
    { width: 14 },
    { width: 20 },
    // Fourth column missing intentionally
  ];

  await writeXlsxFile(data, {
    columns, // (optional) column widths, etc.
    filePath: await fnReturnExcelFilesFolderPath("testDataCol.xlsx"),
  });
}

// Test Function with objSchema
async function fnTestWithObjSchema() {
  const objects = [
    {
      name: "David Hdz",
      age: 1800,
      dateOfBirth: new Date(),
      graduated: true,
    },
    {
      name: "Jairo Lope",
      age: 2600.5,
      dateOfBirth: new Date(),
      graduated: false,
    },
    {
      name: "Aldo Saucedo",
      age: 2800.6,
      dateOfBirth: new Date(),
      graduated: true,
    },
  ];

  const schema = [
    {
      column: "Name",
      type: String,
      value: (student) => student.name,
      getCellStyle: (student) => {
        return {
          align: "right",
          width: 20,
        };
      },
    },
    {
      column: "Cost",
      type: Number,
      format: "#,##0.00",
      width: 12,
      align: "center",
      value: (student) => student.age,
    },
    {
      column: "Date of Birth",
      type: Date,
      format: "mm/dd/yyyy",
      value: (student) => student.dateOfBirth,
    },
    {
      column: "Graduated",
      type: Boolean,
      value: (student) => student.graduated,
    },
  ];

  await writeXlsxFile(objects, {
    schema,
    sheet: "Test Schema",
    filePath: await fnReturnExcelFilesFolderPath("test-schema.xlsx"),
  });

  await writeXlsxFile([objects, objects], {
    sheets: ["Sheet One", "Sheet Two"],
    schema: [schema, schema],
    filePath: await fnReturnExcelFilesFolderPath(
      "test-schema-multiple-sheets.xlsx"
    ),
  });
}

// Test Function with objSchema
async function fnWriteXLSXWithObjSchema(
  objectXLSX,
  schemaXLSX,
  sheetNameXLSX,
  filePathXLSX
) {
  try {
    if (!Array.isArray(objectXLSX) || objectXLSX.length === 0) {
      throw new Error(
        "The 'objects' parameter must be an array of objects and cannot be empty."
      );
    }
    if (!Array.isArray(schemaXLSX) || schemaXLSX.length === 0) {
      throw new Error(
        "The 'schema' parameter must be an array and cannot be empty."
      );
    }

    await writeXlsxFile(objectXLSX, {
      schema: schemaXLSX,
      sheet: sheetNameXLSX,
      filePath: filePathXLSX,
    });
  } catch (error) {
    logger.error(`Error generating XLSX file: ${error.message}`);
  }
}

// Test Function with objSchema
async function fnWriteXLSXWithSheetsObjSchema(
  objectsXLSX,
  schemasXLSX,
  sheetsXLSX,
  filePathXLSX
) {
  try {
    if (!Array.isArray(objectsXLSX) || objectsXLSX.length === 0) {
      throw new Error(
        "The 'objects' parameter must be an array of objects and cannot be empty."
      );
    }
    if (!Array.isArray(schemasXLSX) || schemasXLSX.length === 0) {
      throw new Error(
        "The 'schemas' parameter must be an array and cannot be empty."
      );
    }

    await writeXlsxFile(objectsXLSX, {
      sheets: sheetsXLSX,
      schema: schemasXLSX,
      filePath: filePathXLSX,
    });
  } catch (error) {
    logger.error(`Error generating XLSX file: ${error.message}`);
  }
}

async function fnSaveObjectToFile(filePath, dataFoundFile) {
  try {
    // Convertir el objeto en líneas de texto plano
    const lines = dataFoundFile.map((item) => {
      return `${item.key},${item.regex},${item.result}`;
    });

    // Unir las líneas con saltos de línea
    const fileContent = lines.join("\n");

    // Guardar el contenido en el archivo especificado
    await fs.promises.writeFile(filePath, fileContent, "utf8");

    console.log(`Archivo guardado exitosamente en: ${filePath}`);
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
  }
}

async function fnAppendObjectToFileWithHeader(filePath, newObjects, header) {
  try {
    let existingContent = "";

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // Read existing content
      existingContent = await fs.promises.readFile(filePath, "utf8");
    }

    // Convert the new object to plain text lines, including the header
    const newContent = [
      header,
      ...newObjects.map((item) => `${item.key},${item.result},`),
      //...newObjects.map((item) => `${item.key},${item.regex},${item.result}`),
    ].join("\n");

    // Merge existing content with new lines
    const updatedContent = existingContent.trim()
      ? `${existingContent.trim()}\n${newContent}`
      : newContent;

    // Save updated content to file
    await fs.promises.writeFile(filePath, updatedContent, "utf8");

    logger.info(`File successfully updated in: ${filePath}`);
  } catch (error) {
    logger.error(`Error updating file: ${error}`);
  }
}

async function isValidNewObjects(newObjects) {
  // Verify that it is an array and is not empty
  if (!Array.isArray(newObjects) || newObjects.length === 0) {
    logger.error("newObjects is not an array or is empty.");
    return false;
  }

  // Verify that each element has the necessary keys
  const isValid = newObjects.every(
    (obj) =>
      obj &&
      typeof obj.key === "string" &&
      typeof obj.regex === "string" &&
      typeof obj.result === "string"
  );

  if (!isValid) {
    logger.error("newObjects contains invalid elements.");
    return false;
  }

  return true;
}

export {
  fnTestWithDataColumns,
  fnTestWithObjSchema,
  fnWriteXLSXWithObjSchema,
  fnWriteXLSXWithSheetsObjSchema,
  fnAppendObjectToFileWithHeader,
  isValidNewObjects,
};
