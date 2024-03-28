import './App.css';
import {Routes,Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Layout from './components/Layout';
import Indexpage from './Pages/Indexpage';
import {UserContextProvider} from './components/UserContext';
import CreatePost from './Pages/CreatePost';
import Postpage from './Pages/Postpage';

function App() {
  return (
    <main>
      <UserContextProvider>
       <Routes>
       <Route path='/' element={<Layout/>}>
       <Route index element={<Indexpage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/create' element={<CreatePost/>}/>
        <Route path='/post/:id' element={<Postpage/>}/>
        </Route>
       </Routes>
       </UserContextProvider>
  
      </main>
  );
}

export default App;
