import { FaCheckCircle, FaStar, FaMoneyBill } from 'react-icons/fa'
import { FiStar, FiSend } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, } from 'react'

import userPhoto from '../assets/media/user.jpg'
import Navbar from "../components/Navbar";
import Navigation from "../components/Navigation";
import Button from '../components/Button'
import CardStatusTransfer from '../components/CardStatusTransfer'
import CardEnterPin from '../components/CardEnterPin'
import TransferSteps from "../components/TransferSteps";
import ResponsiveNavigation from "../components/ResponsiveNavigation"
import { useDispatch, useSelector } from 'react-redux'
import { setTransfer } from '../redux/reducers/transfer'
import { removeTransfer } from '../redux/reducers/transfer'
import axios from 'axios'



const TransferDetail = () => {

  const [statusTransfer, setStatusTransfer] = useState(false)
  const [cardStatusShow, setCardStatusShow] = useState(false)
  const [cardEnterPinShow, setCardEnterPinShow] = useState(false)
  const dispatch = useDispatch()

  const [verified, setVerified] = useState(false)
  const [isFavorite, setIsFavorite] = useState(true)
  
  const {id} = useParams()
  const sender = useSelector(state => state.profile.data)
  
  const setData = (e) => {
    e.preventDefault()
    const {value: transferAmount} = e.target.transferAmount
    const {value: notes} = e.target.notes

    dispatch(setTransfer({
      amount: transferAmount,
      senderId: sender.id,
      recipientId: id,
      note: notes
    }))

    setCardEnterPinShow(true)

  }

  
  const dataSender = useSelector(state => state.profile.data)
  const data = useSelector(state => state.transfer.data)
  const token = useSelector(state=>state.auth.token)
  const sendPin = async (e) => {
    e.preventDefault()
    try{
      
    const {value: pin} = e.target.pin
    const form = new URLSearchParams()
    form.append('pin', pin)
    const {data : res} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/transfer/${dataSender.id}`, form.toString())

    if(res.success === true){
      const form2 = new URLSearchParams()
      form2.append('senderId', dataSender.id)
      form2.append('amount', data.amount)
      form2.append('recipientId', data.recipientId)
      form2.append('note', data.note)

      const  {data: result} =  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/customer/transfer`, form2, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      console.log(result)
      if(result.succes){
        setCardEnterPinShow(false)
        setStatusTransfer(true)
        setCardStatusShow(true)
        dispatch(removeTransfer())
      }else{
        setCardEnterPinShow(false)
        setStatusTransfer(false)
        setCardStatusShow(true)
      }
    }
    }catch(err){
      console.log(err)
      console.log(data.note)
      // console.log(data.amount)
    }
  }

    return (
      <>
        <Navbar home={false} login={true} dashboard={false} />
        <main className="h-fit sm:h-[48rem] flex pt-10">
          <Navigation />

          <section className="relative flex flex-col flex-1 gap-4 pt-4 sm:pl-8 ">
            <div className="items-center hidden gap-4 pt-10 sm:flex pl">
              <FiSend size={20} color="#764abc" />
              <div className="font-bold">Transfer Money</div>
            </div>

            <TransferSteps/>

            <div className="flex flex-col flex-1 gap-4 p-4 sm:border sm:mr-10 sm:mb-10 sm:gap-8">
              <div className="font-bold">People Information</div>

              <div className="flex justify-between items-center sm:pl-8 bg-[#E8E8E84D] rounded p-4">
                <div className="flex gap-4">
                  <div>
                    <img
                      src={userPhoto}
                      className="object-cover w-20 h-20 rounded"
                    />
                  </div>

                  <div className="flex flex-col justify-center gap-1">
                    <p className='text-sm sm:text-base'>Ghaluh</p>
                    <p className="text-[#4F5665] text-sm sm:text-base">(239)555-0108</p>
                    {verified &&
                    <button className="text-white bg-[#764abc] rounded flex items-center justify-center gap-3 p-1">
                      <FaCheckCircle />
                      <p className="text-xs">Verified</p>
                    </button>
                    }
                  </div>
                </div>

                {isFavorite ? (
                  <FaStar color="orange" />
                ) : (
                  <FiStar color="#4F5665" />
                )}
              </div>

              <form onSubmit={setData} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <p className="font-bold">Amount</p>
                  <p className="text-[#4F5665] text-xs">
                    Type the amount you want to transfer and then press continue
                    to the next steps.
                  </p>
                  <label className="flex items-center w-full gap-2 p-2 border rounded">
                    <FaMoneyBill />
                    <input
                      type="text"
                      name="transferAmount"
                      id="transferAmount"
                      placeholder="Enter Nominal Transfer"
                      className="text-[#4F5665] w-full outline-none bg-transparent text-xs sm:text-sm"
                    />
                  </label>
                </label>

                <label className="flex flex-col gap-2">
                  <p className="font-bold">Notes</p>
                  <p className="text-[#4F5665] text-xs">
                    You can add some notes for this transfer such as payment
                    coffee or something
                  </p>
                  <textarea
                    className="w-full border rounded flex items-center gap-2 p-2 outline-none text-[#4F5665] text-xs sm:text-sm"
                    name="notes"
                    id="notes"
                    placeholder="Enter Some Notes"
                  />
                </label>

                <Button value="Submit & Transfer" />
              </form>

              <CardStatusTransfer
                cardStatusShow={cardStatusShow}
                statusTransfer={statusTransfer}
                setCardStatusShow={setCardStatusShow}
              />

              <CardEnterPin cardEnterPinShow={cardEnterPinShow} submit={sendPin} />
            </div>

            <ResponsiveNavigation/>
          </section>
        </main>
      </>
    );
}

export default TransferDetail;