/**
 * ClassificationScheme.js
 *
 * Manages Classification Scheme loading and checking
 *
 */
import chalk from "chalk";
import { readFile } from "fs";
import { parseXmlString } from "libxmljs2";

import { handleErrors } from "./fetch-err-handler.js";

import { AvlTree } from "@datastructures-js/binary-search-tree";

import { hasChild } from "./schema_checks.js";
import { isHTTPURL } from "./pattern_checks.js";

import { dvb } from "./DVB_definitions.js";

export const CS_URI_DELIMITER = ":";

/**
 * Constructs a linear list of terms from a heirarical clssification schemes which are read from an XML document and parsed by libxmljs
 *
 * @param {String} CSuri           the classification scheme domian
 * @param {Object} term            the classification scheme term that may include nested subterms
 * @param {boolean} leafNodesOnly  flag to indicate if only the leaf <term> values are to be loaded
 */
function addCSTerm(vals, CSuri, term, leafNodesOnly = false) {
	if (term.type() != "element") return;
	if (term.name() == dvb.e_Term) {
		if (!leafNodesOnly || (leafNodesOnly && !hasChild(term, dvb.e_Term))) if (term.attr(dvb.a_termID)) vals.push(`${CSuri}${CS_URI_DELIMITER}${term.attr(dvb.a_termID).value()}`);
		let st = 0,
			subTerm;
		while ((subTerm = term.child(st++)) != null) addCSTerm(vals, CSuri, subTerm, leafNodesOnly);
	}
}

/**
 * load the hierarical values from an XML classification scheme document into a linear list
 *
 * @param {String} xmlCS             the XML document  of the classification scheme
 * @param {boolean} leafNodesOnly    flag to indicate if only the leaf <term> values are to be loaded
 * @returns {Object} values parsed from the classification scheme in .vals and uri of classification scheme in .uri
 */
function loadClassificationScheme(xmlCS, leafNodesOnly = false) {
	let rc = { uri: null, vals: [] };
	if (!xmlCS) return rc;

	let CSnamespace = xmlCS.root().attr(dvb.a_uri);
	if (!CSnamespace) return rc;
	rc.uri = CSnamespace.value();
	let t = 0,
		term;
	while ((term = xmlCS.root().child(t++)) != null) addCSTerm(rc.vals, rc.uri, term, leafNodesOnly);
	return rc;
}

export default class ClassificationScheme {
	#values;
	#schemes;
	#leafsOnly;

	constructor() {
		this.#values = new AvlTree();
		this.#schemes = [];
		this.#leafsOnly = false;
		loadClassificationScheme.bind(this);
	}

	count() {
		return this.#values.count();
	}

	empty() {
		this.#values.clear();
		this.#schemes = [];
	}

	insertValue(key, value = true) {
		if (key != "") this.#values.insert(key, value);
	}

	valuesRange() {
		return this.#leafsOnly ? "-only leaf nodes are used from the CS" : "all nodes in the CS are used";
	}

	/**
	 * read a classification scheme from a URL and load its hierarical values into a linear list 
	 *
	 * @param {String} csURL URL to the classification scheme

	 */
	#loadFromURL(csURL) {
		let isHTTPurl = isHTTPURL(csURL);
		console.log(chalk.yellow(`${isHTTPurl ? "" : "--> NOT "}retrieving CS (${this.#leafsOnly ? "leaf" : "all"} nodes) from ${csURL} via fetch()`));
		if (!isHTTPurl) return;

		fetch(csURL)
			.then(handleErrors)
			.then((response) => response.text())
			.then((strXML) => loadClassificationScheme(parseXmlString(strXML), this.#leafsOnly))
			.then((res) => {
				res.vals.forEach((e) => {
					this.insertValue(e, true);
				});
				this.#schemes.push(res.uri);
			})
			.catch((error) => console.log(chalk.red(`error (${error}) retrieving ${csURL}`)));
	}

	/**
	 * read a classification scheme from a local file and load its hierarical values into a linear list
	 *
	 * @param {String} classificationScheme the filename of the classification scheme
	 */
	#loadFromFile(classificationScheme) {
		console.log(chalk.yellow(`reading CS (${this.#leafsOnly ? "leaf" : "all"} nodes) from ${classificationScheme}`));

		readFile(classificationScheme, { encoding: "utf-8" }, (err, data) => {
			if (!err) {
				let res = loadClassificationScheme(parseXmlString(data.replace(/(\r\n|\n|\r|\t)/gm, "")), this.#leafsOnly);
				res.vals.forEach((e) => {
					this.insertValue(e, true);
				});
				this.#schemes.push(res.uri);
			} else console.log(chalk.red(err));
		});
	}

	loadCS(options) {
		if (!options) options = {};
		if (!Object.prototype.hasOwnProperty.call(options, "leafNodesOnly")) options.leafNodesOnly = false;
		this.#leafsOnly = options.leafNodesOnly;

		if (options.file) this.#loadFromFile(options.file);
		if (options.files) options.files.forEach((file) => this.#loadFromFile(file));
		if (options.url) this.#loadFromURL(options.url);
		if (options.urls) options.urls.forEach((url) => this.#loadFromURL(url));
	}

	/**
	 * determines if the value is in the classification scheme
	 *
	 * @param {String} value    The value to check for existance
	 * @returns {boolean} true if value is in the classification scheme
	 */
	isIn(value) {
		return this.#values.has(value);
	}

	/**
	 * determines if the scheme used by the provided term is included
	 * @param {String} term     The term whose scheme should bechecked
	 * @returns {boolean}
	 */
	hasScheme(term) {
		let pos = term.lastIndexOf(CS_URI_DELIMITER);
		if (pos == -1) return false;
		return this.#schemes.includes(term.slice(0, pos));
	}

	showMe(prefix = "") {
		console.log(`in showme("${prefix}"), count=${this.#values.count()}`);
		this.#values.traverseInOrder((node) => {
			if (prefix == "" || node.getValue().beginsWith(prefix)) console.log(node.getValue());
		});
	}
}
