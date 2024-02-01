const  getCurrentTime = async ({area, location}) => {
    return "2021-08-10T16:00:00.000000+00:00"
    const response = await fetch(`http://worldtimeapi.org/api/timezone/${area}/${location}`, {
        method: 'GET',
    })

    const {datetime} = await response.json()
    console.log({datetime})

    return datetime
}

export default getCurrentTime