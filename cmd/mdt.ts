/**
 * mdts.ts - this is a command line program exposing the functionality of metadata tools to
 * the shell on POSIX systems.
 */
import {
  appInfo,
  normalizeArXivID,
  normalizeDOI,
  normalizeISBN,
  normalizeISNI,
  normalizeISSN,
  normalizeLCNAF,
  normalizeORCID,
  normalizePMCID,
  normalizePMID,
  normalizeROR,
  normalizeSNAC,
  normalizeUUID,
  normalizeVIAF,
  normalizorFunc,
  OptionsProcessor,
  validateArXivID,
  validateDOI,
  validateISBN,
  validateISNI,
  validateISSN,
  validateLCNAF,
  validateORCID,
  validatePMCID,
  validatePMID,
  validateROR,
  validateSNAC,
  validateUUID,
  validateVIAF,
  validatorFunc,
  verifyArXivID,
  verifyDOI,
  verifyFunc,
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

const app_name = "mtd";

/**
 * helpText assembles the help information for Metadata Tools.
 *
 * @param helpOpt {[k: string]: string} helpOpt holds the help options defined for the app.
 */
function helpText(helpOpt: { [k: string]: string }): string {
  const version = appInfo.version;
  const release_date = appInfo.releaseDate;
  const release_hash = appInfo.releaseHash;

  const txt: string[] = [
    `%${app_name}(1) user manual | ${version} ${release_date} ${release_hash}
% R. S.Doiel
% ${release_date} ${release_hash}
    
# NAME
    
${app_name}
    
# SYNOPSIS
    
${app_name} [OPTIONS] normalize|validate|verify ID_TYPE IDENTIFIER
    
# DESCRIPTION
    
${app_name} will normalize, validate or verify the identifier provided
based on the type provided. Validate and verify it will return the text
'true' or 'false' and set an error level. Normalize will return the
normalized string.

NOTE: verify requires network access.

# ID_TYPE

The following identifier types are supported (type name are case insensitive).

- ArXiv
- DOI
- ISBN
- ISSN
- ISNI
- LCNAF
- ORCID
- PMID
- PMCID
- ROR
- SNAC
- UUID (NOTE: verification unavailable, returns undefined with exit code 3)
- VIAF

# OPTIONS
`,
  ];

  for (let attr in helpOpt) {
    const msg = helpOpt[attr];
    txt.push(`${attr}
  : ${msg}
`);
  }
  txt.push(`
# EXAMPLE

${app_name} used to normalize, validate and verify an ORCID.

~~~shell
${app_name} normalize orcid 0000-0003-0900-6903
${app_name} validate orcid 0000-0003-0900-6903
${app_name} verify orcid 0000-0003-0900-6903
~~~
  
`);
  return txt.join("\n");
}

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
        console.log('undefined');
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
  const op: OptionsProcessor = new OptionsProcessor();

  op.booleanVar("help", false, "display help");
  op.booleanVar("license", false, "display license");
  op.booleanVar("version", false, "display version");
 
  op.parse(Deno.args);

  const options = op.options;
  const args = op.args;

  if (options.help) {
    console.log(helpText(op.help));
    Deno.exit(0);
  }
  if (options.license) {
    console.log(appInfo.licenseText);
    Deno.exit(0);
  }
  if (options.version) {
    console.log(`${appInfo.appName} ${appInfo.version} ${appInfo.releaseHash}`);
    Deno.exit(0);
  }

  if (args.length !== 3) {
    console.log(
      `UPDATE: ${app_name} normalize|validate|verify ID_TYPE IDENTIFIER`,
    );
    Deno.exit(1);
  }
  // dispatch the request to the appropriate method and data type.
  const verb: string = args[0].toLocaleLowerCase().trim();
  const idType: string = args[1].toLocaleLowerCase().trim();
  const identifier: string = args[2].toLocaleLowerCase().trim();
  let exitCode = 1;
  switch (idType) {
    case 'arxiv':
      exitCode = await action(
        normalizeArXivID,
        validateArXivID,
        verifyArXivID,
        verb,
        identifier,
      );
      break;
    case "doi":
      exitCode = await action(normalizeDOI, validateDOI, verifyDOI, verb, identifier);
      break;
    case "isbn":
      exitCode = await action(normalizeISBN, validateISBN, verifyISBN, verb, identifier);
      break;
    case "issn":
      exitCode = await action(normalizeISSN, validateISSN, verifyISSN, verb, identifier);
      break;
    case "isni":
      exitCode = await action(normalizeISNI, validateISNI, verifyISNI, verb, identifier);
      break;
    case "lcnaf":
      exitCode = await action(normalizeLCNAF, validateLCNAF, verifyLCNAF, verb, identifier);
      break;
    case "orcid":
      exitCode = await action(normalizeORCID, validateORCID, verifyORCID, verb, identifier);
      break;
    case "pmid":
      exitCode = await action(normalizePMID, validatePMID, verifyPMID, verb, identifier);
      break;
    case "pmcid":
      exitCode = await action(normalizePMCID, validatePMCID, verifyPMCID, verb, identifier);
      break;
    case "ror":
      exitCode = await action(normalizeROR, validateROR, verifyROR, verb, identifier);
      break;
    case "snac":
      exitCode = await action(normalizeSNAC, validateSNAC, verifySNAC, verb, identifier);
      break;
    case "uuid":
      exitCode = await action(normalizeUUID, validateUUID, undefined, verb, identifier);
      break;
    case "viaf":
      exitCode = await action(normalizeVIAF, validateVIAF, verifyVIAF, verb, identifier);
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
