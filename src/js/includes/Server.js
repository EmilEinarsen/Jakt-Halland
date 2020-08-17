import {} from './helpers'
import Tools from './Tools'
const tools = new Tools()
const date = new Date()

export default function Server(tools) {
	this.data

	this.fetch = async () => {
		if(this.data) return
		try {
			const [events] = await Promise.all([
				(await fetch("https://wordpress.jakthalland.se/wp-json/wp/v2/events")).json(),
			])
			sortData(events)
		} catch (err) {
		  	console.log(err)
		}
	}

	const sortData = (events) => {
		this.data = {
			events: [...events]
			.filter(event => isEventInFuture(event.acf.startDate))
			.map(event => {
				return {
					event: event.acf.event,
					info: {
						text: event.acf.text,
						startDate: event.acf.startDate,
						endDate: event.acf.endDate,
					}
				}
			})
			.sort((eventA, eventB) => {
				console.log(tools.turnDateStringIntoIntObject(eventA.info.startDate))
				return tools.compareDates(
					tools.turnDateStringIntoIntObject(eventA.info.startDate), 
					tools.turnDateStringIntoIntObject(eventB.info.startDate)
				)
			})
		}
	}
	const isEventInFuture = eventStart => {
		const currentDate = getDate()
		const eventDate = tools.turnDateStringIntoIntObject(eventStart)
		return tools.compareDates(currentDate, eventDate) === (0 || -1) ? true : false
	}
	this.getEventsByEvent = () => {
		return [...this.data.events].reduce(([hunter, leader], event) => {
			return event.event === "Jägarexamen (Intensiv)" ? [[...hunter, event], leader] : [hunter, [...leader, event]];
		}, [[], []])
	}

	const getDate = () => {
		return {
			date: date.getDate(),
			month: date.getMonth() + 1,
			year: date.getFullYear(),
		}
	}
}