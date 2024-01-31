const  getCurrentTime = async ({area, location}) => {
    const response = await fetch(`http://worldtimeapi.org/api/timezone/${area}/${location}`, {
        method: 'GET',
    })

    const {datetime} = await response.json()

    return datetime
}

export default getCurrentTime