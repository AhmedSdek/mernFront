import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../conestans/baseUrl';
import { useParams } from 'react-router-dom';

function EditProduct() {
    const { id } = useParams()
    console.log(id)
    const [data, setData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/menu/${id}`); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData.data); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, []); // Empty dependency array to run once on component mount
    console.log(data)
    return (
        <div>EditProduct</div>
    )
}

export default EditProduct