import React, { useEffect, useState } from 'react'; // Import React library and hooks for component and state management
import { v4 as uuidv4 } from 'uuid'; // Import UUID library to generate unique identifiers for items
import { ToastContainer, toast } from 'react-toastify'; // Import Toast for displaying notifications
import 'react-toastify/dist/ReactToastify.css'; // Import default CSS for Toast notifications styling
import './custom-toast.css'; // Import custom CSS for further styling Toast notifications
import './mobile-responsive.css'; // Import custom CSS for mobile responsiveness
import './scrollbar.css'; // Import custom CSS for scrollbar styling

const Manager = () => {
  // State to manage the visibility of the password
  const [showPassword, setShowPassword] = useState(false);
  // State to store the current password value
  const [password, setPassword] = useState('');
  
  const handleClick = () => {
    // Logs the current password to the console
    console.log(password);
  };
  
  // State to manage form input values
  const [form, setForm] = useState({
    site: '',
    username: '',
    password: '',
  });

  // State to store an array of passwords
  const [passwordArray, setPasswordArray] = useState([]);
  // State to determine if the form is in editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State to store the ID of the password being edited
  const [editId, setEditId] = useState(null);

  // Function to fetch passwords from the backend server
  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setPasswordArray(passwords); // Update state with fetched passwords
    console.log(passwords); // Log passwords to the console for debugging
  };

  useEffect(() => {
    getPasswords(); // Fetch passwords when the component mounts
  }, []);

  // Function to set up the form for editing an existing password
  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(item => item._id === id);
    if (passwordToEdit) {
      setForm({
        site: passwordToEdit.site,
        username: passwordToEdit.username,
        password: passwordToEdit.password,
      });
      setIsEditing(true); // Set editing mode to true
      setEditId(id); // Store the ID of the password being edited
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle visibility state
  };

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value, // Update the form state with the new input value
    });
  };

  // Function to copy text to the clipboard and show a toast notification
  const copyText = (text) => {
    navigator.clipboard.writeText(text) // Copy text to clipboard
      .catch(err => {
        console.error('Failed to copy text: ', err); // Log errors if the copy operation fails
      });
    toast(`📋 Copied! ${text}`, { // Show a toast notification on successful copy
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressClassName: 'multicolor-progress',
      theme: "dark",
    });
  };

  // Function to save or update password
  const savePassword = async () => {
    let updatedArray;
    const url = isEditing ? `http://localhost:3000/edit/${editId}` : "http://localhost:3000/";
    const method = isEditing ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method: method, // Use PUT method for editing and POST method for adding new passwords
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form), // Send form data as JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw error if response is not ok
      }
  
      const result = await response.json();
  
      if (result.success) {
        if (isEditing) {
          updatedArray = passwordArray.map(item =>
            //...form will create onj id new
            item._id === editId ? { ...form ,_id:editId} : item // Update the specific password item
          );
          toast('📝 Password Updated!', {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressClassName: 'multicolor-progress',
            theme: "dark",
          });
        } else {
          updatedArray = [...passwordArray, { ...form, _id: result.result.insertedId }]; // Add new password with a generated ID
          toast('✅ Password Saved!', {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressClassName: 'multicolor-progress',
            theme: "dark",
          });
        }
  
        setPasswordArray(updatedArray); // Update the state with the new password list
        localStorage.setItem("password", JSON.stringify(updatedArray)); // Store the updated passwords in localStorage
        setIsEditing(false); // Reset editing mode
        setEditId(null); // Clear the edit ID
        setForm({ site: "", username: "", password: "" }); // Clear the form
      } else {
        toast('❌ Failed to save password', {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressClassName: 'multicolor-progress',
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error saving password:', error); // Log error if the save operation fails
      toast('❌ Error saving password', {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: 'multicolor-progress',
        theme: "dark",
      });
    }
  };
  
  // Function to handle deletion of a password
  const deletePassword = async (id) => {
    alert("Are you sure to delete this Data"); // Confirmation prompt for deletion
    if (!id) {
      console.error('No ID provided for deletion'); // Log error if no ID is provided
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE', // Use DELETE method to remove a password(just state the resourse from client that the req need to delete)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw error if response is not ok
      }
  
      const updatedArray = passwordArray.filter(item => item._id !== id); // Filter out the deleted password
      setPasswordArray(updatedArray); // Update state with the remaining passwords
      localStorage.setItem("password", JSON.stringify(updatedArray)); // Update localStorage
      toast('🗑️ Password Deleted!', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: 'multicolor-progress',
        theme: "dark",
      });
    } catch (error) {
      console.error('Error deleting password:', error); // Log error if the delete operation fails
      toast('❌ Error deleting password', {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: 'multicolor-progress',
        theme: "dark",
      });
    }
  };
  
  const handleSubmit = () => {
    // Declare formData with current form values
    const formData = {
      site: form.site,
      username: form.username,
      password: form.password,
    };
    // Log formData to console for debugging
    console.log(formData);
  };
  return (
    <>
<div className="absolute inset-0 -z-10 h-[1200px] w-full items-start px-5 bg-gradient-to-r from-black via-blue-600 to-black"></div>
      <div className='container rounded-[29px] mx-auto h-[1009px] bg-blue-200 max-w-4xl my-14 p-8 '>

        <div className='font-bold mt-0 my-5 text-center'>
          <span className='text-2xl sm:text-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-black  bg-clip-text text-transparent'>
            &lt;Pass
          </span>
          <span className='text-2xl sm:text-3xl bg-gradient-to-r from-blue-500 via-blue-900 to-black bg-clip-text text-transparent'>
            Manager/&gt;
          </span>
          <p className='font-cursive text-blue-900 text-lg sm:text-xl mt-2'>Your Own Password Manager</p>
        </div>
        <div className='text-white flex flex-col gap-6'>
          <input
            className="inputs rounded-full border border-blue-500 w-full text-black py-2  sm:py-3 sm:px-6"
            type="text"
            name="site"
            value={form.site}
            onChange={handleChange}  // Ensure this is correct
            placeholder='Enter Website URL'
          />
          <div className='flex flex-col sm:flex-row sm:gap-4'>
            <input
              className="inputs rounded-full border border-blue-500 w-full text-black py-2 px-6 sm:py-3 sm:px-6"
              value={form.username}
              onChange={handleChange}
              placeholder='Enter Username'
              name='username'
              type="text"
            />
            <div className="relative w-full mt-4 sm:mt-0">
              <input
                value={form.password}
                onChange={handleChange}
                name='password'
                className="inputs rounded-full border border-blue-500 w-full text-black py-2 px-4 pr-12 sm:py-3 sm:px-6"
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter Password'
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <lord-icon
                  src="https://cdn.lordicon.com/vfczflna.json"
                  trigger="loop"
                  stroke="bold"
                  delay="2000"
                  state="hover-look-around"
                  colors="primary:#121331,secondary:#242424"
                  style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                  onClick={togglePasswordVisibility}>
                </lord-icon>
              </div>
            </div>
          </div>
          <div className='flex justify-center mt-4'>
            <button
              className="flex items-center justify-center border border-blue-400 bg-gradient-to-r from-blue-400 via-blue-700 to-blue-900 w-full sm:w-1/2 lg:w-1/3 rounded-full h-12 hover:text-black hover:from-blue-800 hover:via-blue-400 hover:to-blue-400"
              onClick={savePassword}>
              <div className="relative w-6 h-6 mr-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-black rounded-full">
                  <lord-icon
                    src="https://cdn.lordicon.com/jgnvfzqg.json"
                    trigger="loop"
                    colors="primary:#fff"
                    className="w-6 h-6"
                    delay="1000"
                  />
                </div>
              </div>
              <span>Save</span>
            </button>
          </div>
          <div className="passwords flex flex-col justify-center items-center -my-3 ">
            <h2 className='bg-gradient-to-r from-black via-blue-800 to-black bg-clip-text text-transparent text-2xl font-bold my-5 ml-4 overflow-y-auto'>
              Your Passwords
            </h2>
            {passwordArray.length === 0 && <div className='text-blue-950'> No password to Show</div>}
            {passwordArray.length !== 0 &&
              <div className="table-container table-wrapper h-[560px] overflow-y-auto">  {/* Added custom scrollbar */}
                <table className="table-fixed my-table my-1 w-full border-collapse shadow-lg text-white rounded-lg overflow-hidden bg-gradient-to-r from-black via-blue-800 to-black">
  <thead className="t-head">
    <tr className="flex justify-between gap-40 py-3 px-12">
      <th className="flex site-info">Site</th>
      <th className="flex username">Username</th>
      <th className="flex relative site-password">
        Passwords
        <div className="move">
          <div className="absolute inset-y right-20 flex items-center pr-3">
            <lord-icon
              src="https://cdn.lordicon.com/vfczflna.json"
              trigger="loop"
              stroke="bold"
              delay="2000"
              state="hover-look-around"
              colors="primary:#fffff,secondary:#ffffff"
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
              onClick={togglePasswordVisibility}
            ></lord-icon>
          </div>
        </div>
      </th>
      <th className="actions flex">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 text-slate-900 font-bold">
  {passwordArray.map((item) => (
    <tr key={item._id}> {/* Use item._id as the key */}
      <td className="py-3 px-7 border-b border-slate-800 site-name" style={{ maxWidth: '200px' }}>
        <div className="flex items-center gap-3" >
          <button onClick={() => copyText(item.site)} className="flex-shrink-0 relative group">
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 w-[50px] group-hover:opacity-100 bg-yellow-500 bg-opacity-50 text-gray-900 text-xs rounded-md px-2 py-1 transition-opacity duration-300">
  Copy
</span>
            <video
              width="30"
              height=""
              loop
              muted
              autoPlay
              className="mr-2 hover:shadow-lg hover:shadow-blue-900 transition-all duration-300 rounded-2xl"
            >
              <source src="copy.webm" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </button>
          <input
            className="bg-transparent focus:outline-none overflow-hidden text-ellipsis"
            type="text"
            name="site"
            value={item.site} // Use item.site here
            placeholder="Site"
            readOnly
            style={{ maxWidth: 'calc(140% - 40px)' }}
          />
        </div>
      </td>

      <td className="site-info py-3 px-6 border-b border-slate-800 site-username" style={{ maxWidth: '800px' }}>
        <div className="overflow-x-auto whitespace-nowrap gap-3">
          <button onClick={() => copyText(item.username)} className='relative group'>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-8 opacity-0 w-[50px] group-hover:opacity-100 bg-yellow-500 bg-opacity-50 text-gray-900 text-xs rounded-md px-2 py-1 transition-opacity duration-300">
  Copy
</span>
            <video
              width="30"
              height=""
              loop
              muted
              autoPlay
              className="mr-6 ml-5 hover:shadow-lg hover:shadow-blue-900 transition-all duration-300 rounded-2xl w-[35px]"
            >
              <source src="copy.webm" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </button>
          <input
            className="align-middle text-left bg-transparent focus:outline-none overflow-hidden"
            type="text"
            name="username"
            value={item.username} // Use item.username here
            placeholder="Username"
            style={{ width: '160%', maxWidth: 'calc(250% - 50px)' }}
          />
        </div>
      </td>

      <td
        className="pass py-4 px-2 border-b border-slate-800 site-password"
        style={{ maxWidth: '800px', marginLeft: '90px' }}
      >
        <button onClick={() => copyText(item.password)} className='relative group'>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 w-[50px] group-hover:opacity-100 bg-yellow-500 bg-opacity-50 text-gray-900 text-xs rounded-md px-2 py-1 transition-opacity duration-300">
  Copy
</span>
          <video
            width="35"
            height=""
            loop
            muted
            autoPlay
            className="mr-6 ml-5 hover:shadow-lg hover:shadow-blue-900 transition-all duration-300 rounded-2xl"
          >
            <source src="copy.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </button>
        <input
          className="align-middle text-left bg-transparent focus:outline-none overflow-x"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={item.password} // Use item.password here
          placeholder="Password"
          style={{ maxWidth: '90px', textOverflow: 'ellipsis' }}
        />
      </td>

      <td className="ed py-3 px-5 text-center border-b border-slate-800 action">
        <button onClick={() => editPassword(item._id)} className='relative group'>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 w-[100px] group-hover:opacity-100 bg-green-600 bg-opacity-50 text-gray-900 text-xs rounded-md px-2 py-1 transition-opacity duration-300">
  Edit the record
</span>
          <video
            width="30"
            height=""
            loop
            muted
            autoPlay
            className="mr-5 ml-12 hover:shadow-lg hover:shadow-blue-900 transition-all duration-300 rounded-2xl w-[35px]"
          >
            <source src="Edit.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </button>
        {/*relative group: The button element has both relative and group classes. The relative class is used to position the tooltip correctly, and the group class allows the use of the group-hover utility.
Tooltip with group-hover: The tooltip (span) uses group-hover:opacity-100 to ensure it only appears when the button (or the video within it) is hovered.
Video Button: The video remains as the clickable area within the button, and the tooltip appears on hover. */}
        <button className='relative group' onClick={() => deletePassword(item._id)}>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 w-[120px] group-hover:opacity-100 bg-red-600 bg-opacity-50 text-gray-900 text-xs rounded-md px-2 py-1 transition-opacity duration-300">
  Delete the record
</span>

          <video
            width="30"
            
            height=""
            loop
            muted
            autoPlay
            className="mr-2 hover:shadow-lg hover:shadow-blue-900 transition-all duration-300 rounded-2xl w-[35px]"
          >
            <source src="delete.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </button>
      </td>
    </tr>
  ))}
</tbody>

</table>

              </div>
            }
          </div>
        </div>
      </div>
      <ToastContainer />

    </>
  );
};

export default Manager;
