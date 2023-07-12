const docGenerator = new DocGenerator(['ts', 'js'], ['node_modules']);'
const docs = docGenerator.generateDocs('.');
docGenerator.saveDocs('./out');

