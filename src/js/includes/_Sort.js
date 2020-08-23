function Sort() {
	this.sortData = (events) => {
		server.data = {
			events: [...events].filter(event => validate.isEventInFuture(event.acf.startDate))
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
				return tools.compareDates(
					tools.dateStringIntoIntObject(eventA.info.startDate), 
					tools.dateStringIntoIntObject(eventB.info.startDate)
				)
			})
		}
	}
	this.sortDataByEvent = () => {
		return [...server.data.events].reduce(([intensive, leader, calm, weekend, other], event) => (
				event.event === "Jägarexamen (Intensiv)" ? [[...intensive, event], leader, calm, weekend, other]
					: event.event === "Jaktledarutbildning" ? [intensive, [...leader, event], calm, weekend, other]
						: event.event === "Jägarexamen (Lugn)" ? [intensive, leader, [...calm, event], weekend, other]
							: event.event === "Jakt helg" ? [intensive, leader, calm, [...weekend, event], other]
								: [intensive, leader, calm, weekend, [...other, event]]
			), [[], [], [], [], []]
		)
	}
}