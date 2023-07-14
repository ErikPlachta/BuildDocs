import {BuildDocs} from './BuildDocs.ts';

const docGenerator = new BuildDocs(['ts', 'js'], ['node_modules']);'
const docs = docGenerator.generateDocs('.');
docGenerator.saveDocs('./out');

