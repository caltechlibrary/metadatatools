
 ls -1 *.ts | grep -v '_test.ts' | grep -v 'deps.ts'| grep -v 'demo_' | grep -v 'mod.ts' \
 while read -r FNAME; do
    echo
    echo "// ${FNAME} export"
    echo "export {"
    grep 'export' "${FNAME}" | \
    grep -v 'export {' | \
    cut -d '('  -f 1 | \
    sed -E 's/export//;s/function//;s/async//';
    echo "} from './${FNAME}';"  ;
 done