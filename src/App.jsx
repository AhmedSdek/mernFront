import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Nav from './Components/nav/Nav'
import Home from './Pages/Home'
import Cart from './Components/cart/Cart'
import Regester from './Auth/Register'
import Login from './Auth/Login'
import ProtectedRoute from './Components/protectedRoute/ProtectedRoute'
import Dashboard from './admin/Dashboard'
import CheckOut from './Pages/CheckOut'
import OrderSuccess from './Pages/OrderSuccess'
import MyOrdersPage from './Pages/MyOrders'
import Orders from './admin/Orders'
import CreateProduct from './admin/CreateProduct'
import AcceptedOrders from './admin/AcceptedOrders'

function App() {
  const [count, setCount] = useState(0)
  // const dispatch = useDispatch()
  return (
    <>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/register' element={<Regester />} />
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} >
            <Route path='dashboard/create' element={<CreateProduct />} />
            <Route path='dashboard/orders' element={<Orders />} />
            <Route path='dashboard/accepted-orders' element={<AcceptedOrders />} />
          </Route>
        </Route>
        <Route path='/checkout' element={<CheckOut />} />
        <Route path='/order-success' element={<OrderSuccess />} />
        <Route path='/my-orders' element={<MyOrdersPage />} />
      </Routes>
    </>
  )
}

export default App
