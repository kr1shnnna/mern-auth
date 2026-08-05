import Navbar from "../components/Navbar"
import Header from "../components/Header"


const Home = () => {
  return (
    <div
  className="
    min-h-screen
    flex flex-col
    items-center
    justify-center
    bg-[url('/bg_img.jpg')]
    bg-cover
    bg-center
    bg-no-repeat
  "
>
       <Navbar />
       <Header />
    </div>
  )
}

export default Home