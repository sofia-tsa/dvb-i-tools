/**
 CSLoaders.js

 Load Classification Schemes and other File related resources
*/
import chalk from "chalk";

import ClassificationScheme from "./ClassificationScheme.js";
//import Role from "./Role.js";

import IANAlanguages from "./IANAlanguages.js";
import ISOcountries from "./ISOcountries.js";

import {
	IANA_Subtag_Registry,
	TVA_ContentCS,
	TVA_FormatCS,
	DVBI_ContentSubject,
	ISO3166,
	TVA_PictureFormatCS,
	DVBI_ServiceTypeCS,
	DVB_AudioCodecCS,
	MPEG7_AudioCodingFormatCS,
	DVB_AudioConformanceCS,
	DVB_VideoCodecCS,
	MPEG7_VisualCodingFormatCS,
	DVB_VideoConformanceCS,
	MPEG7_AudioPresentationCS,
	DVBI_RecordingInfoCS,
	DVB_ColorimetryCS,
	TVA_AccessibilityPurposeCS,
	TVA_AudioPurposeCS,
	TVA_SubitleCarriageCS,
	TVA_SubitleCodingFormatCS,
	TVA_SubitlePurposeCS,
	TVA_ContentAlertCS,
	DVBI_ParentalGuidanceCS,
} from "./data-locations.js";

export function LoadCountries(useURLs) {
	console.log(chalk.yellow.underline("loading countries..."));
	let c = new ISOcountries(false, true);
	c.loadCountries(useURLs ? { url: ISO3166.url } : { file: ISO3166.file });
	return c;
}

export function LoadLanguages(useURLs) {
	console.log(chalk.yellow.underline("loading languages..."));
	let l = new IANAlanguages();
	l.loadLanguages(
		useURLs
			? {
					url: IANA_Subtag_Registry.url,
					purge: true,
			  }
			: {
					file: IANA_Subtag_Registry.file,
					purge: true,
			  }
	);
	return l;
}

export function LoadVideoCodecCS(useURLs) {
	console.log(chalk.yellow.underline("loading Video Codecs..."));
	let cs = new ClassificationScheme();
	cs.loadCS(
		useURLs
			? {
					urls: [DVB_VideoCodecCS.y2007.url, DVB_VideoCodecCS.y2021.url, DVB_VideoCodecCS.y2022.url, MPEG7_VisualCodingFormatCS.url],
					leafNodesOnly: true,
			  }
			: {
					files: [DVB_VideoCodecCS.y2007.file, DVB_VideoCodecCS.y2021.file, DVB_VideoCodecCS.y2022.file, MPEG7_VisualCodingFormatCS.file],
					leafNodesOnly: true,
			  }
	);
	return cs;
}

export function LoadAudioCodecCS(useURLs) {
	console.log(chalk.yellow.underline("loading Audio Codecs..."));
	let cs = new ClassificationScheme();
	cs.loadCS(
		useURLs
			? {
					urls: [DVB_AudioCodecCS.y2007.url, DVB_AudioCodecCS.y2020.url, MPEG7_AudioCodingFormatCS.url],
					leafNodesOnly: true,
			  }
			: {
					files: [DVB_AudioCodecCS.y2007.file, DVB_AudioCodecCS.y2020.file, MPEG7_AudioCodingFormatCS.file],
					leafNodesOnly: true,
			  }
	);
	return cs;
}

export function LoadGenres(useURLs) {
	let cs = new ClassificationScheme();
	console.log(chalk.yellow.underline("loading Genres ..."));
	cs.loadCS(
		useURLs
			? {
					urls: [TVA_ContentCS.url, TVA_FormatCS.url, DVBI_ContentSubject.url],
			  }
			: {
					files: [TVA_ContentCS.file, TVA_FormatCS.file, DVBI_ContentSubject.file],
			  }
	);
	return cs;
}

export function LoadAccessibilityPurpose(useURLs) {
	console.log(chalk.yellow.underline("loading Accessibility Purposes..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: TVA_AccessibilityPurposeCS.url, leafNodesOnly: true } : { file: TVA_AccessibilityPurposeCS.file, leafNodesOnly: true });
	return cs;
}

export function LoadAudioPurpose(useURLs) {
	console.log(chalk.yellow.underline("loading Audio Purposes..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: TVA_AudioPurposeCS.url, leafNodesOnly: true } : { file: TVA_AudioPurposeCS.file, leafNodesOnly: true });
	return cs;
}

export function LoadSubtitleCarriages(useURLs) {
	console.log(chalk.yellow.underline("loading Subtitle Carriages..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: TVA_SubitleCarriageCS.url } : { file: TVA_SubitleCarriageCS.file });
	return cs;
}

export function LoadSubtitleCodings(useURLs) {
	console.log(chalk.yellow.underline("loading Subtitle Codings..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: TVA_SubitleCodingFormatCS.url } : { file: TVA_SubitleCodingFormatCS.file });
	return cs;
}

export function LoadSubtitlePurposes(useURLs) {
	console.log(chalk.yellow.underline("loading Subtitle Purposes..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: TVA_SubitlePurposeCS.url } : { file: TVA_SubitlePurposeCS.file });
	return cs;
}

export function LoadAudioConformanceCS(useURLs) {
	console.log(chalk.yellow.underline("loading Audio Conformance Points..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: DVB_AudioConformanceCS.url, leafNodesOnly: true } : { file: DVB_AudioConformanceCS.file, leafNodesOnly: true });
	return cs;
}
export function LoadVideoConformanceCS(useURLs) {
	console.log(chalk.yellow.underline("loading Video Conformance Points..."));
	let cs = new ClassificationScheme();
	cs.loadCS(
		useURLs
			? {
					urls: [DVB_VideoConformanceCS.y2017.url, DVB_VideoConformanceCS.y2021.url, DVB_VideoConformanceCS.y2022.url],
					leafNodesOnly: true,
			  }
			: {
					files: [DVB_VideoConformanceCS.y2017.file, DVB_VideoConformanceCS.y2021.file, DVB_VideoConformanceCS.y2022.file],
					leafNodesOnly: true,
			  }
	);
	return cs;
}

export function LoadAudioPresentationCS(useURLs) {
	console.log(chalk.yellow.underline("loading AudioPresentation..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: MPEG7_AudioPresentationCS.url } : { file: MPEG7_AudioPresentationCS.file });
	return cs;
}

export function LoadRecordingInfoCS(useURLs) {
	console.log(chalk.yellow.underline("loading Recording Info..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: DVBI_RecordingInfoCS.url } : { file: DVBI_RecordingInfoCS.file });
	return cs;
}

export function LoadPictureFormatCS(useURLs) {
	console.log(chalk.yellow.underline("loading PictureFormats..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: TVA_PictureFormatCS.url } : { file: TVA_PictureFormatCS.file });
	return cs;
}

export function LoadColorimetryCS(useURLs) {
	console.log(chalk.yellow.underline("loading Colorimetry..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: DVB_ColorimetryCS.y2020.url, leafNodesOnly: true } : { file: DVB_ColorimetryCS.y2020.file, leafNodesOnly: true });
	return cs;
}

export function LoadServiceTypeCS(useURLs) {
	console.log(chalk.yellow.underline("loading ServiceTypes..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { url: DVBI_ServiceTypeCS.url } : { file: DVBI_ServiceTypeCS.file });
	return cs;
}

export function LoadRatings(useURLs) {
	console.log(chalk.yellow.underline("loading Ratings..."));
	let cs = new ClassificationScheme();
	cs.loadCS(useURLs ? { urls: [TVA_ContentAlertCS.url, DVBI_ParentalGuidanceCS.url] } : { files: [TVA_ContentAlertCS.file, DVBI_ParentalGuidanceCS.file] });
	return cs;
}
