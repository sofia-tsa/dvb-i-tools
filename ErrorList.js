/**
 * ErrorList.js
 * 
 * Manages errors and warnings for the application
 * 
 */

import { parseXmlString } from "libxmljs2";

export const ERROR=1, WARNING=2, APPLICATION=3;

export default class ErrorList {

	constructor() {
		this.countsErr=[]; this.numCountsE=0;   // keep these counters as arrays constructed by 
		this.countsWarn=[]; this.numCountsW=0;   // direct insertion do not maintain them
		this.errors=[];
		this.warnings=[];
		this.markupXML=[];
	}
	loadDocument(doc) {
		let lines=parseXmlString(doc).toString().split('\n');
		this.markupXML=lines.map((str, index) => ({ value: str, ix: index }));
	}
	/* private */ setError(err, lineNo) {
		let found=this.markupXML.find(line => (line.ix==lineNo));
		if (found) {
			if (!found.validationErrors)
				found.validationErrors=[];
			found.validationErrors.push(err);
		}
	}
	/* private */ increment(key) {
		if (this.countsErr[key]===undefined)
			this.set(key);
		else this.countsErr[key]++;
	}
	set(key,value=1) {
		this.countsErr[key]=value;
		this.numCountsE++;
	}
	/* private */ incrementW(key) {
		if (this.countsWarn[key]===undefined)
			this.setW(key);
		else this.countsWarn[key]++;
	}
	setW(key,value=1) {
		this.countsWarn[key]=value;
		this.numCountsW++;
	}

	/**
	 * 
	 * @param {integer} e.type     (optional) ERROR(default) or WARNING
	 * @param {sring} e.code       Error code
	 * @param {string} e.message   The error message
	 * @param {string} e.key       (optional)The category of the message
	 * @param {string or libxmljs2:Node} e.fragment (optional) The XML fragment (or node in the XML document) triggering the error
	 * @param {integer} e.line     (optional) the line number of the element in the XML document that triggered the error
	 */
	addError(e) {
		let _INVALID_CALL='invalid addError call';
		if (!e.type) e.type=ERROR;

		if (![ERROR, WARNING, APPLICATION].includes(e.type)) this.push(`addError() called with invalid type property (${e.type})`, _INVALID_CALL);
		if (!e.code) {
			this.errors.push({code:"ERR001", message:'addError() called without errNo property'});
			this.increment(_INVALID_CALL);
		}
		if (!e.message) {
			this.errors.push({code:"ERR002", message:'addError() called without errMessage property'});
			this.increment(_INVALID_CALL);
		}
		let newError={code:e.code, message:e.message, 
						element:e.fragment?((typeof(e.fragment)=="string" || e.fragment instanceof String)?e.fragment:e.fragment.toString()):null
		};

		switch (e.type) {
			case ERROR: 
				this.errors.push(newError);
				if (e.key) this.increment(e.key);
				break;
			case APPLICATION:
				this.errors.push(newError);
				this.increment('application process error');
				break;
			case WARNING: 
				this.warnings.push(NewError);
				if (e.key) this.incrementW(e.key);
				break;
		}
		if (e.line)
			this.setError(e.message, e.line);
	} 
	numErrors() { return this.errors.length; }
	numWarnings() { return this.warnings.length; }

	numCountsErr() { return this.numCountsE; }
	numCountsWarn() { return this.numCountsW; }
 }
