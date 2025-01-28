import logger from "../logs_module/logs.controller.js";
import {
  fnLoadJSONFile,
  fnReturnNaturalClassFolderPath,
} from "./file.utils.controller.js";
import { fnOcrEDR, fnOcrEDRegexv } from "./ocrfile.controller.js";

async function fnSearchAdvanceRegexJSON(fileClassify, dirPathDoc) {
  let arrClassifyNatural = fileClassify.split(/_/);
  let classifyProductsSamples = await fnLoadJSONFile(
    await fnReturnNaturalClassFolderPath("natural.classify.products.json")
  );
  let classifyDocsSamples = await fnLoadJSONFile(
    await fnReturnNaturalClassFolderPath("natural.classify.docs.json")
  );
  let idClassifyTypeFileToFind = arrClassifyNatural[0]; // Name of the catalog to search
  // Search the product catalog (Policies)
  if (idClassifyTypeFileToFind == classifyProductsSamples.idClassifyTypeFile) {
    let idToFind = arrClassifyNatural[1]; // ID in the 'id' field of the body
    let insuranceNameToFind = arrClassifyNatural[3]; // Name to search for in 'name_insurance'

    // Find the object with the specified id
    let foundItem = classifyProductsSamples.body.find(
      (item) => item.id == idToFind
    );

    if (!foundItem) {
      logger.warn(
        `No item was found with that policy categorization: ${idToFind}`
      );
      return;
    }

    // Search 'insurance_list' for the object with the specified insurance name
    let foundInsurance = foundItem.insurance_list.find(
      (insurance) => insurance.name_insurance == insuranceNameToFind
    );

    if (!foundInsurance) {
      logger.warn(
        `No insurance found with name_insurance: ${insuranceNameToFind}`
      );
      return;
    }

    // Verificar si se encuentra habilitado el formato con enable
    if (!foundInsurance.enable) {
      logger.warn(
        `Insurance with name_insurance: ${insuranceNameToFind} is disabled (enable = false).`
      );
      return;
    }

    // Get plain text from PDF using OCR
    let docTextPlain = await fnOcrEDR(dirPathDoc);

    /* console.log(foundInsurance.regex_exclusions); */
    /* console.log(docTextPlain); */
    /* 
      -Nombre de Cliente
      -Montos Desglosados
      -Montos Totales
      -Tipo de Documento
      -Compañía Aseguradora
      -Coberturas
      -Exclusiones
      -Asegurados */

    // Create patterns with the necessary regex and execute them to search for the information with the plain text of the OCR
    let patterns = [
      {
        key: "seClientName",
        regex: foundInsurance.regex_client_name,
        result: null,
      },
      {
        key: "seBreakdownAmounts",
        regex: foundInsurance.regex_breakdown_amounts,
        result: null,
      },
      {
        key: "seTotalAmounts",
        regex: foundInsurance.regex_total_amounts,
        result: null,
      },
      {
        key: "seInsuranceCompany",
        regex: foundInsurance.regex_insurance_company,
        result: null,
      },
      {
        key: "seCoverages",
        regex: foundInsurance.regex_coverages,
        result: null,
      },
      {
        key: "seExclusions",
        regex: foundInsurance.regex_exclusions,
        result: null,
      },
      { key: "seInsured", regex: foundInsurance.regex_insured, result: null },
    ];

    patterns.forEach(({ key, regex }) => {
      const match = docTextPlain.match(regex);

      if (match && match[1] && match[1].trim() !== "") {
        // If we find a value, we save it
        patterns.find((item) => item.key === key).result = match[1].trim();
      } else {
        // If it is the case of 'seInsuranceCompany', we assign the value of foundInsurance.name_insurance
        if (key === "seInsuranceCompany") {
          patterns.find((item) => item.key === key).result =
            foundInsurance.name_insurance;
        } else {
          // For the other cases, we assign 'Not Found'
          patterns.find((item) => item.key === key).result = "No encontrado";
        }
      }
    });

    // Display the results saved in the patterns object
    patterns.forEach(({ key, result }) => {
      logger.info(`${key}: ${result}`);
    });

    logger.info(`seClassifyDocument: ${fileClassify}`);

    return patterns;
  }
  // Search the docs catalog (Documents)
  else if (idClassifyTypeFileToFind == classifyDocsSamples.idClassifyTypeFile) {
    let idToFind = arrClassifyNatural[1]; // ID in the 'id' field of the body
    let insuranceNameToFind = arrClassifyNatural[3]; // Name to search for in 'name_insurance'

    // Find the object with the specified id
    let foundItem = classifyDocsSamples.body.find(
      (item) => item.id == idToFind
    );

    if (!foundItem) {
      console.log(
        `No item was found with that documents categorization: ${idToFind}`
      );
      return;
    }

    // Buscar en 'regex_list' el objeto con el nombre de seguro especificado
    let foundInsurance = foundItem.regex_list.find(
      (insurance) => insurance.name_insurance == insuranceNameToFind
    );

    if (!foundInsurance) {
      console.log(
        `No document found with name_insurance: ${insuranceNameToFind}`
      );
      return;
    }

    // Verificar si se encuentra habilitado el formato con enable
    if (!foundInsurance.enable) {
      console.log(
        `Document with name_insurance: ${insuranceNameToFind} is disabled (enable = false).`
      );
      return;
    }

    // Get plain text from PDF using OCR
    let docTextPlain = await fnOcrEDR(dirPathDoc);

    /* console.log(docTextPlain); */

    // Create patterns with the necessary regex and execute them to search for the information with the plain text of the OCR
    let patterns = [
      {
        key: "seClientName",
        regex: foundInsurance.regex_client_name,
        result: null,
      },
      {
        key: "seBreakdownAmounts",
        regex: foundInsurance.regex_breakdown_amounts,
        result: null,
      },
      {
        key: "seTotalAmounts",
        regex: foundInsurance.regex_total_amounts,
        result: null,
      },
      {
        key: "seInsuranceCompany",
        regex: foundInsurance.regex_insurance_company,
        result: null,
      },
      {
        key: "seCoverages",
        regex: foundInsurance.regex_coverages,
        result: null,
      },
      {
        key: "seExclusions",
        regex: foundInsurance.regex_exclusions,
        result: null,
      },
      { key: "seInsured", regex: foundInsurance.regex_insured, result: null },
    ];

    patterns.forEach(({ key, regex }) => {
      const match = docTextPlain.match(regex);

      if (match && match[1] && match[1].trim() !== "") {
        // If we find a value, we save it.
        patterns.find((item) => item.key === key).result = match[1].trim();
      } else {
        // If it is the case of 'seInsuranceCompany', we assign the value of foundInsurance.name_insurance
        if (key === "seInsuranceCompany") {
          patterns.find((item) => item.key === key).result =
            foundInsurance.name_insurance;
        } else {
          // For the other cases, we assign 'Not Found'
          patterns.find((item) => item.key === key).result = "No encontrado";
        }
      }
    });

    // Display the results saved in the patterns object
    patterns.forEach(({ key, result }) => {
      logger.info(`${key}: ${result}`);
    });

    logger.info(`seClassifyDocument: ${fileClassify}`);

    return patterns;
  }
}

export { fnSearchAdvanceRegexJSON };
