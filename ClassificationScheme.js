/**
 * ClassificationScheme.js
 * 
 * Manages Classification Scheme loading and checking
 * 
 */
import { readFile } from 'fs';
import { parseXmlString } from 'libxmljs2';

import fetch from 'node-fetch';
import { handleErrors } from "./fetch-err-handler.js";

import { AvlTree } from '@datastructures-js/binary-search-tree';

import { hasChild } from "./schema_checks.js";


/**
 * Constructs a linear list of terms from a heirarical clssification schemes which are read from an XML document and parsed by libxmljs
 *
 * @param {String} CSuri The classification scheme domian
 * @param {Object} term The classification scheme term that may include nested subterms
 * @param {boolean} leafNodesOnly flag to indicate if only the leaf <term> values are to be loaded 
 */
function addCSTerm(vals, CSuri, term, leafNodesOnly=false) {
	if (term.type()!="element") return;
	if (term.name()==="Term") {
		if (!leafNodesOnly || (leafNodesOnly && !hasChild(term, "Term")))
 			if (term.attr("termID")) 
				vals.push(`${CSuri}:${term.attr("termID").value()}`);
		let st=0, subTerm;
		while ((subTerm=term.child(st++))!=null)
			addCSTerm(vals, CSuri, subTerm, leafNodesOnly);
	}
}


/**
 * load the hierarical values from an XML classification scheme document into a linear list 
 *
 * @param {String} xmlCS the XML document  of the classification scheme
 * @param {boolean} leafNodesOnly flag to indicate if only the leaf <term> values are to be loaded
 * @returns {Array} values parsed from the classification scheme 
 */
function loadClassificationScheme(xmlCS, leafNodesOnly=false) {
	let vals=[];
	if (!xmlCS) return vals;
	let CSnamespace = xmlCS.root().attr("uri");
	if (!CSnamespace) return vals;
	let t=0, term;
	while ((term=xmlCS.root().child(t++))!=null)
		addCSTerm(vals, CSnamespace.value(), term, leafNodesOnly);
	return vals;
}	


export default class ClassificationScheme {

	constructor () {
		this.values=new AvlTree();
		loadClassificationScheme.bind(this);
	}

	count() {
		return this.values.count();
	}

	empty() {
		this.values.clear();
	}

	insertValue(key, value) {
		this.values.insert(key, value);
	}

	/**
	 * read a classification scheme from a URL and load its hierarical values into a linear list 
	 *
	 * @param {String} csURL URL to the classification scheme
	 * @param {boolean} leafNodesOnly flag to indicate if only the leaf <term> values are to be loaded 
	 */
	loadFromURL(csURL, leafNodesOnly=false) {
		console.log(`retrieving CS (${leafNodesOnly?"all":"leaf"} nodes) from ${csURL} via fetch()`); 
		fetch(csURL)
			.then(handleErrors)
			.then(response => response.text())
			.then(strXML => loadClassificationScheme(parseXmlString(strXML), leafNodesOnly).forEach(e=>{this.insertValue(e, true);}))
			.catch(error => console.log(`error (${error}) retrieving ${csURL}`));
	}

	/**
	 * read a classification scheme from a local file and load its hierarical values into a linear list 
	 *
	 * @param {String} classificationScheme the filename of the classification scheme
	 * @param {boolean} leafNodesOnly flag to indicate if only the leaf <term> values are to be loaded 
	 */
	loadFromFile(classificationScheme, leafNodesOnly=false) {
		console.log(`reading CS (${leafNodesOnly?"leaf":"all"} nodes) from ${classificationScheme}`);

 		readFile(classificationScheme, {encoding: "utf-8"}, (err,data)=> {
 			if (!err) 
				loadClassificationScheme(parseXmlString(data.replace(/(\r\n|\n|\r|\t)/gm,"")), leafNodesOnly).forEach(e=>{this.insertValue(e, true);});
			else console.log(err);
		});
	}


	loadCS(options) {
		if (!options) options={};
		if (!options.leafNodesOnly) options.leafNodesOnly=false;

		if (options.file)
			this.loadFromFile(options.file, options.leafNodesOnly);
		if (options.files)
			options.files.forEach(file => this.loadFromFile(file, options.leafNodesOnly));  
		if (options.url)
			this.loadFromURL(options.url, options.leafNodesOnly);
		if (options.urls)
			options.urls.forEach(url => this.loadFromURL(url, options.leafNodesOnly));
	}

	/**
	 * determines if the value is in the classification scheme
	 *
	 * @param {String} value           The value to check for existance
	 * @returns {boolean} true if value is in the classification scheme
	 */
	isIn(value) {
		return this.values.has(value);
	}
}