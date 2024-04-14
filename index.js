const superagent = require("superagent");
require("dotenv").config();
const log = require("./appLogger.js");
// const https = require('https');

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const defaultUserAgent = "api-user";

async function getGuest(guestId) {	
	const targetUrl = `${process.env.ngrok_base_url}/guests/${guestId}`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body;
};

async function getFieldDefinition(fieldDefinitionId) {	
	const targetUrl = `${process.env.ngrok_base_url}/fielddefinitions/${fieldDefinitionId}`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body;
};

async function getField(fieldId) {	
	const targetUrl = `${process.env.ngrok_base_url}/fields/${fieldId}`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body;
};

async function getFieldEntity(entityId, entityType) {	
	const targetUrl = `${process.env.ngrok_base_url}/fields?entity_id=${entityId}&entity_type=${entityType}`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body;
};

async function getBookingFields(propertyId, from, to) {	
	const targetUrl = `${process.env.ngrok_base_url}/bookings?property_ids=${propertyId}&include_fields=true&from=${from}&to${to}`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body.items.shift().fields;
};

async function getBooking(bookingId) {	
	// const targetUrl = `${process.env.owner_rez_base_url}/booking/${bookingId}`;
    // const authHeader = Buffer.from(`${process.env.owner_rez_username}:${process.env.owner_rez_token}`, 'utf8').toString('base64');    
    // const response = await fetch(targetUrl, {
    //   headers:{
    //     "Content-Type": "application/json",
    //     "Authorization": `Basic ${authHeader}`,
    //     "User-Agent": process.env.owner_rez_user_agent
    //   },
	//   agent: new https.Agent({ rejectUnauthorized: true, requestCert: false})
    // });    
    // return await response.json();

	const targetUrl = `${process.env.ngrok_base_url}/bookings/${bookingId}`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body;
};


async function getBookings() {	
	const targetUrl = `${process.env.owner_rez_base_url}/bookings/?since_utc=2023-01-01`;
	const response = await superagent
		.get(targetUrl)
		.set("User-Agent", process.env.owner_rez_user_agent || defaultUserAgent)
		.auth(`${process.env.owner_rez_username}`, `${process.env.owner_rez_token}`, { type: "auto", });	  
	//log.current.debug(response.body);
	return response.body;
};

async function getTestQuote() {
	log.current.debug(process.argv);
	//await sleep(20000);
	const targetUrl = `${process.env.owner_rez_legacy_url}/quotes`;
	const externalId = "orp5b5fbb7x";
	const quoteDetails = {		  
		propertyId: Number(`0x${externalId.replace(/orp5b/gi, "").replace(/x/gi, "")}`),
		arrival: "2024-05-02",
		departure: "2024-05-06",
		adults: 2
	};
	const encoded = Buffer.from(`${process.env.owner_rez_username}:${process.env.owner_rez_token}`, 'utf8').toString('base64')
	log.current.debug({ Encoded: encoded});	
	const response = await fetch(targetUrl, {
		method: 'TEST',
		body: JSON.stringify(quoteDetails),
		headers: new Headers({
			"Content-Type": "application/json",
			"Authorization": `Basic ${encoded}`,
			"User-Agent": `${process.env.owner_rez_user_agent || defaultUserAgent}`
		})			
    });
	const result = await response.json();
	//log.current.debug(result);
	return result;
};

module.exports = {
	getBookingFields,
	getFieldDefinition,
	getField,
	getFieldEntity,
	getGuest,
	getBooking,
	getBookings,
	getTestQuote
}