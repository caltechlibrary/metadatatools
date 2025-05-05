/**
 * mdts.ts - this is a command line program exposing the functionality of metadata tools to
 * the shell on POSIX systems.
 */
import { parseArgs } from "@std/cli/parse-args";
import {
  version,
  licenseText,
  releaseDate,
  releaseHash,
  helpText,
  fmtHelp,
  normalizeArXivID,
  normalizeDOI,
  normalizeEMAIL,
  normalizeISBN,
  normalizeISNI,
  normalizeISSN,
  normalizeLCNAF,
  normalizeORCID,
  normalizePMCID,
  normalizePMID,
  normalizeROR,
  normalizeSNAC,
  normalizeTEL,
  normalizeUUID,
  normalizeVIAF,
  type normalizorFunc,
  validateArXivID,
  validateDOI,
  validateEMAIL,
  validateISBN,
  validateISNI,
  validateISSN,
  validateLCNAF,
  validateORCID,
  validatePMCID,
  validatePMID,
  validateROR,
  validateSNAC,
  validateTEL,
  validateUUID,
  validateVIAF,
  type validatorFunc,
  verifyArXivID,
  verifyDOI,
  type verifyFunc,
  verifyISBN,
  verifyISNI,
  verifyISSN,
  verifyLCNAF,
  verifyORCID,
  verifyPMCID,
  verifyPMID,
  verifyROR,
  verifySNAC,
  verifyVIAF,
} from "../deps.ts";


/**
 * action dispatches the verb using the identifier provided. It will set the exite code and display results
 * to standard output.
 *
 * @param normalize
 * @param validate
 * @param verify
 * @param verb
 * @param identifier
 * @return number, exit code value
 */
async function action(
  normalize: normalizorFunc,
  validate: validatorFunc,
  verify: verifyFunc | undefined,
  verb: string,
  identifier: string,
): Promise<number> {
  let exitCode = 0;
  switch (verb) {
    case "normalize":
      console.log(normalize(identifier));
      break;
    case "validate":
      if (validate(identifier)) {
        console.log("true");
      } else {
        console.log("false");
      }
      break;
    case "verify":
      if (verify === undefined) {
        console.log("undefined");
        exitCode = 3;
      } else {
        const ok = await verify(identifier);
        if (ok) {
          console.log("true");
        } else {
          console.log("false");
        }
      }
      break;
    default:
      console.log(`ERROR: ${verb} action is not supported`);
      exitCode = 1;
      break;
  }
  return exitCode;
}

/**
 * main() - this is the main entry point for the command line program.
 */
async function main() {
  const appName = "mtd";
  const app = parseArgs(Deno.args, {
    alias: {
      help: "h",
      license: "l",
      version: "v",
      format: "f",
      deno: "d",
      init: "i",
    },
    default: {
      help: false,
      version: false,
      license: false,
      format: "",
      deno: false,
      init: "",
    },
  });
  const args = app._;


  if (app.help) {
    console.log(fmtHelp(helpText, appName, version, releaseDate, releaseHash));
    Deno.exit(0);
  }
  if (app.license) {
    console.log(licenseText);
    Deno.exit(0);
  }
  if (app.version) {
    console.log(`${appName} ${version} ${releaseHash}`);
    Deno.exit(0);
  }

  if (args.length !== 3) {
    console.log(
      `UPDATE: ${appName} normalize|validate|verify ID_TYPE IDENTIFIER`,
    );
    Deno.exit(1);
  }
  // dispatch the request to the appropriate method and data type.
  const verb: string = `${args[0]}`.toLocaleLowerCase().trim();
  const idType: string = `${args[1]}`.toLocaleLowerCase().trim();
  const identifier: string = `${args[2]}`.toLocaleLowerCase().trim();
  let exitCode = 1;
  switch (idType) {
    case "arxiv":
      exitCode = await action(
        normalizeArXivID,
        validateArXivID,
        verifyArXivID,
        verb,
        identifier,
      );
      break;
    case "doi":
      exitCode = await action(
        normalizeDOI,
        validateDOI,
        verifyDOI,
        verb,
        identifier,
      );
      break;
    case "email":
      exitCode = await action(
        normalizeEMAIL,
        validateEMAIL,
        undefined,
        verb,
        identifier,
      );
      break;
    case "isbn":
      exitCode = await action(
        normalizeISBN,
        validateISBN,
        verifyISBN,
        verb,
        identifier,
      );
      break;
    case "issn":
      exitCode = await action(
        normalizeISSN,
        validateISSN,
        verifyISSN,
        verb,
        identifier,
      );
      break;
    case "isni":
      exitCode = await action(
        normalizeISNI,
        validateISNI,
        verifyISNI,
        verb,
        identifier,
      );
      break;
    case "lcnaf":
      exitCode = await action(
        normalizeLCNAF,
        validateLCNAF,
        verifyLCNAF,
        verb,
        identifier,
      );
      break;
    case "orcid":
      exitCode = await action(
        normalizeORCID,
        validateORCID,
        verifyORCID,
        verb,
        identifier,
      );
      break;
    case "pmid":
      exitCode = await action(
        normalizePMID,
        validatePMID,
        verifyPMID,
        verb,
        identifier,
      );
      break;
    case "pmcid":
      exitCode = await action(
        normalizePMCID,
        validatePMCID,
        verifyPMCID,
        verb,
        identifier,
      );
      break;
    case "ror":
      exitCode = await action(
        normalizeROR,
        validateROR,
        verifyROR,
        verb,
        identifier,
      );
      break;
    case "snac":
      exitCode = await action(
        normalizeSNAC,
        validateSNAC,
        verifySNAC,
        verb,
        identifier,
      );
      break;
    case "tel":
      exitCode = await action(
        normalizeTEL,
        validateTEL,
        undefined,
        verb,
        identifier,
      );
      break;
    case "uuid":
      exitCode = await action(
        normalizeUUID,
        validateUUID,
        undefined,
        verb,
        identifier,
      );
      break;
    case "viaf":
      exitCode = await action(
        normalizeVIAF,
        validateVIAF,
        verifyVIAF,
        verb,
        identifier,
      );
      break;
    default:
      console.log(`ERROR: ${idType} type is not supported`);
      exitCode = 1;
      break;
  }
  Deno.exit(exitCode);
}

// Run main()
if (import.meta.main) await main();
