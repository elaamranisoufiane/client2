//'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/dashboard.module.css';
import DownloadButton from './DownloadButton';


//increments
const incrementAttempt = async () => {
  try {
    const response = await axios.get('/incrementAttempt', {
      withCredentials: true,
    });
    const dataAsText = JSON.stringify(response.data);

    return dataAsText;
  } catch (error) {
    console.error("Attempt number Check failed:", error);
    return false;
  }
};




const getUsername = async () => {
  try {
    const response = await axios.get('/getUser', {
      withCredentials: true,
    });
    const isAuthenticated = JSON.stringify(response.data);
    return response.data

  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};



const userId = await getUsername().then((result) => {
  return result.id;
});

//const DOMAIN_NAME = "https://aibgen.com";
//const DOMAIN_NAME = "https://cf78-105-71-5-5.ngrok-free.app";
const DOMAIN_NAME = "https://6433-105-158-88-71.ngrok-free.app";

let rm = false;
let gen = false;
let newimagebgr = null;
let count = 0;


const UploadImage = () => {

  const [isLoading, setIsLoading] = useState(null);




  useEffect(() => {
    const myButton = document.getElementById('myButton');
    const choiceModel = document.getElementById('myModal');
    const showLimiteMessage = document.getElementById('showLimiteMessage');
    const closeModelButton = document.getElementById('closeModal');
    const closeModelButtonLimit = document.getElementById('closeModelButton');
    const rmbackground = document.getElementById('checkbox1');
    const genbackground = document.getElementById('checkbox2');
    const generateModelButton = document.getElementById('generateModelButton');

    closeModelButtonLimit.addEventListener('click', hideModelLimit);
    function hideModelLimit() {
      showLimiteMessage.style.display = 'none';
    }

    closeModelButton.addEventListener('click', hideModel)
    myButton.addEventListener('click', showModel);
    function showModel() {
      setDisplaybothimage(true);
      setDisplaygenimage(true);
      setDisplayrmimage(true);
      choiceModel.style.display = 'block';
    }
    function hideModel() {
      choiceModel.style.display = 'none';
    }
    generateModelButton.addEventListener('click', function () {

      if (rmbackground.checked) {
        rm = true;
      } else {
        rm = false;
      }
      if (genbackground.checked) {
        gen = true;
      } else {
        gen = false;
      }
      choiceModel.style.display = 'none';
    });
  }, []);

  const [displayrmimage, setDisplayrmimage] = useState(true);
  const [displayrenimage, setDisplaygenimage] = useState(true);
  const [displaybothimage, setDisplaybothimage] = useState(true);

  //const { data: session } = useSession(); // Get the user session
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [data, setData] = useState(null);
  const [datagen, setDataGen] = useState(null);
  const [datagen2, setDataGen2] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const [selectedCheckBox1, setSelectedCheckBox1] = useState(null);
  const [selectedCheckBox2, setSelectedCheckBox2] = useState(null);

  const [productsDescriptionv1, setProductsDescriptionv1] = useState(false);
  const [productsPricev1, setProductsPricev1] = useState(false);
  const [productsBuyNowUrlv1, setBuyNowUrlv1] = useState(false);
  const [productsDescriptionv2, setProductsDescriptionv2] = useState(false);
  const [productsPricev2, setProductsPricev2] = useState(false);
  const [productsBuyNowUrlv2, setBuyNowUrlv2] = useState(false);
  const [checkOutUrl, setcheckOutUrl] = useState('');
  const [checkOutUrll, setcheckOutUrll] = useState('');
  const [descfield, setDescfield] = useState('');
  const [descError, setDescError] = useState('');
  //galery images vlaues
  //const [url, setUrl] = useState('');
  //const [id_user, setIdUser] = useState('');

  var [checkpass, setCheckPass] = useState(null);
  var [checkSubscribe, setCheckSubscribe] = useState(null);
  //get number of attempt 
  const [numberOfAttenmt, setNumberOfAttenmt] = useState(null);

  //initialize 
  const initialize = async () => {
    setImageUrl(null);
    setData(null);
    setDataGen(null);
    setDataGen2(null);
    setImageUrl2(null);
    //setNumberOfAttenmt(null);
  }

  //var checkpass = true;

  useEffect(() => {
    axios({
      method: "get",
      withCredentials: true,
      url: "/checkNumberOfAttempt"
    })
      .then(respense => {
        setCheckPass(respense.data);
      })
      .catch(err => console.log(err));
  }, []);




  //var checkpass = true;

  useEffect(() => {
    axios({
      method: "get",
      withCredentials: true,
      url: "/checkSubscribe"
    })
      .then(respense => {
        const isPro = JSON.stringify(respense.data);
        setCheckSubscribe(isPro);
        // setCheckSubscribe(0);
      })
      .catch(err => console.log(err));
  }, []);

  //var checkpass = true;

  useEffect(() => {
    axios({
      method: "get",
      withCredentials: true,
      url: "/getNumberOfAttempt"
    })
      .then(respense => {
        setNumberOfAttenmt(respense.data.numberOfAttenmt);
      })
      .catch(err => console.log(err));
  }, []);


  /*
    //show products
    useEffect(() => {
      try {
        axios({
          method: "get",
          withCredentials: true,
          url: "/api/lemonsqueezy1"
        })
          .then(respense => {
            setProductsDescriptionv1(respense.data.attributes.description);
            setProductsPricev1(respense.data.attributes.price_formatted);
            setBuyNowUrlv1(respense.data.attributes.buy_now_url);
  
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.error('Error:', error);
      }
  
    }, []);
  
    useEffect(() => {
      try {
        axios({
          method: "get",
          withCredentials: true,
          url: "/api/lemonsqueezy2"
        })
          .then(respense => {
            setProductsDescriptionv2(respense.data.attributes.description);
            setProductsPricev2(respense.data.attributes.price_formatted);
            setBuyNowUrlv2(respense.data.attributes.buy_now_url);
  
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.error('Error:', error);
      }
    }, []);
  
  */
  //getcheckout url

  useEffect(() => {
    axios({
      method: "get",
      withCredentials: true,
      url: "/api/getCheckOutUrl"
    })
      .then(respense => {
        setcheckOutUrl(respense.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      withCredentials: true,
      url: "/api/getCheckOutUrll"
    })
      .then(respense => {
        setcheckOutUrll(respense.data);
      })
      .catch(err => console.log(err));
  }, []);
  //


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };



  const handleUpload = async () => {
    /*
        setNumberOfAttenmt(await getNumberOfAttempt().then((result) => {
          return result;
        }));
        */
    //test 
    /*
        if (count > 0 && !checkSubscribe) {
          //document.getElementById('showLimiteMessage').style.display = 'block';
          checkpass = false;
        }
        if (checkSubscribe) {
          checkpass = false;
        }
        */

    if (checkSubscribe === 'true') {
      checkpass = true;
    } else {
      if (count < 5 && numberOfAttenmt < 5) {
        checkpass = true;
      } else {
        checkpass = false;
      }
    }



    if (!checkpass) {
      setIsLoading(false);
      document.getElementById('showLimiteMessage').style.display = 'block';
    }
    else if (checkpass) {
      const displayResults = document.getElementById('displayResults');

      //upload image
      if (!selectedFile) {
        return;
      }
      if (gen) {
        if (!descfield.trim()) {
          setDescError('Description is required');
          return;
        } else {
          setDescError('');
        }
      }
      setIsLoading(true);

      try {
        initialize()
        const formData = new FormData();
        formData.append('image', selectedFile);
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          setImageUrl(DOMAIN_NAME + '/uploads/' + response.data.newImageUrl);

          const urlSaved = '/uploads/' + response.data.newImageUrl;
          axios({
            method: "post",
            data: {
              url: urlSaved,
              id_user: userId
            },
            url: "/addImage",
            withCredentials: true,
          })
            .then((data) => {
              //console.log(data.message);
            })
            .catch((error) => {
              console.error(error);
            });

          displayResults.style.display = 'block';
        }


      } catch (error) {
        console.error('Error uploading image:', error);


      }
    }
  };

  //remove  background
  useEffect(() => {
    if (checkSubscribe === 'true') {
      checkpass = true;
    } else {
      if (count < 5 && numberOfAttenmt < 5) {
        checkpass = true;
      } else {
        checkpass = false;
      }
    }
    if (checkpass && checkSubscribe) {

      if (rm === true) {
        if (imageUrl) {
          try {
            setDisplayrmimage(true);
            const encodedUrl = encodeURIComponent(imageUrl);
            fetch(`/api/rmbg?url=${encodedUrl}&gen=${gen}&rm=${rm}`)
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then((responseData) => {
                setDisplayrmimage(false);
                //setData(responseData.newurl);


                if (gen === false) {
                  if (checkSubscribe === 'true') {
                    //save image
                    axios({
                      method: "post",
                      data: {
                        imageURL: responseData.newurl
                      },
                      url: "/downloadImage",
                      withCredentials: true,
                    })
                      .then(respense => {
                        const urlSaved = respense.data.newImageUrl;
                        setData(urlSaved);

                        //if (checkSubscribe === 'true') {
                        axios({
                          method: "post",
                          data: {
                            url: urlSaved,
                            id_user: userId
                          },
                          url: "/addImage",
                          withCredentials: true,
                        })
                          .then((data) => {
                            //console.log(data.message);
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                        //}

                      })
                      .catch(err => console.log(err));

                  } else {
                    setData(responseData.newurl);
                    axios({
                      method: "post",
                      data: {
                        url: responseData.newurl,
                        id_user: userId
                      },
                      url: "/addImage",
                      withCredentials: true,
                    })
                      .then((data) => {
                        //console.log(data.message);
                      })
                      .catch((error) => {
                        console.error(error);
                      });

                  }

                  //checksub 
                  axios({
                    method: "get",
                    withCredentials: true,
                    url: "/checkSubscribe"
                  })
                    .then(respense => {
                      const isPro = JSON.stringify(respense.data);
                      setCheckSubscribe(isPro);
                    })
                    .catch(err => console.log(err));
                  //checknumber
                  axios({
                    method: "get",
                    withCredentials: true,
                    url: "/checkNumberOfAttempt"
                  })
                    .then(respense => {
                      setCheckPass(respense.data);
                    })
                    .catch(err => console.log(err));

                  //getnumber 
                  axios({
                    method: "get",
                    withCredentials: true,
                    url: "/getNumberOfAttempt"
                  })
                    .then(respense => {
                      setNumberOfAttenmt(respense.data.numberOfAttenmt);
                    })
                    .catch(err => console.log(err));
                }
                if (gen === true) {
                  setData(responseData.newurl);
                  handleUpload2(responseData.newurl2)
                    .then((imageUrl3) => {
                      newimagebgr = imageUrl3;
                      //console.log(newimagebgr);
                    })
                    .catch((error) => {
                      console.error('Error:', error);
                    });

                }
              })
              .catch((error) => {
                console.error('Error:', error);
                setIsLoading(false);
                setDisplayrmimage(false);

              });

            incrementAttempt();
            count++;
            setIsLoading(false);
            setDisplayrmimage(false);



          } catch (error) {
            console.error('Error creating object URL:', error);
            setIsLoading(false);

          }

        }

      }
    }
  }, [imageUrl]);
  //save the new removed background image
  const handleUpload2 = async (image_url) => {
    if (checkSubscribe === 'true') {
      checkpass = true;
    } else {
      if (count < 5 && numberOfAttenmt < 5) {
        checkpass = true;
      } else {
        checkpass = false;
      }
    }


    if (checkpass && checkSubscribe) {
      setIsLoading(true);
      const displayResults = document.getElementById('displayResults');
      //upload image
      try {

        const response = await axios.post("/downloadImage", { imageURL: image_url });

        if (response.status === 200) {
          if (gen === true && rm === true) {
            setImageUrl2(image_url);
          } else {
            setImageUrl2(DOMAIN_NAME + '/' + response.data.newImageUrl);
          }

          displayResults.style.display = 'block';

          if (gen === true && rm !== true && checkSubscribe !== 'true') {
            axios({
              method: "post",
              data: {
                url: response.data.newImageUrl,
                id_user: userId
              },
              url: "/addImage",
              withCredentials: true,
            })
              .then((data) => {
                //console.log(data.message);
              })
              .catch((error) => {
                console.error(error);
              });
          }
          if (gen === true && rm === true && checkSubscribe !== 'true') {
            return response.data.newImageUrl;
          } else {
            return DOMAIN_NAME + response.data.newImageUrl;
          }
        }

      } catch (error) {
        setIsLoading(false);
        console.error('Error uploading image:', error);
      }
    }
  }

  //genrate BG
  useEffect(() => {
    if (checkSubscribe === 'true') {
      checkpass = true;
    } else {
      if (count < 5 && numberOfAttenmt < 5) {
        checkpass = true;
      } else {
        checkpass = false;
      }
    }

    //saveImage();

    if (checkpass) {
      if (gen === true) {
        if (rm === true) {
          if (newimagebgr) {
            try {
              setDisplaybothimage(true);
              const encodedUrl = encodeURIComponent(newimagebgr);
              var image_number;
              var NpromptDesc2;
              var NpromptDesc;
              if (document.getElementById('numberImages') != null) { image_number = document.getElementById('numberImages').value; }
              const promptDesc2 = document.getElementById('desc').value;
              const words = promptDesc2.split(" ");
              const promptDescDispatched = words.join("+");
              const promptDesc = encodeURIComponent(promptDescDispatched);


              if (document.getElementById('NegPro') != null) {
                NpromptDesc2 = document.getElementById('NegPro').value;
                const Nwords = NpromptDesc2.split(" ");
                const NpromptDescDispatched = Nwords.join("+");
                NpromptDesc = encodeURIComponent(NpromptDescDispatched);
              } else { NpromptDesc = ""; }

              var size;
              var scale;
              if (document.getElementById('size') != null) { size = encodeURIComponent(document.getElementById('size').value); } else { size = "Original"; }
              if (document.getElementById('scale') != null) { scale = document.getElementById('scale').value; } else { scale = 1; }

              fetch(`/api/genbg?url=${encodedUrl}&promptDesc=${promptDesc}&image_number=${image_number}&NpromptDesc=${NpromptDesc}&size=${size}&scale=${scale}`)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((responseData) => {
                  setDataGen2(responseData.newurl);
                  setIsLoading(false);
                  setDisplaybothimage(false);

                  //checksub 
                  axios({
                    method: "get",
                    withCredentials: true,
                    url: "/checkSubscribe"
                  })
                    .then(respense => {
                      const isPro = JSON.stringify(respense.data);
                      setCheckSubscribe(isPro);

                    })
                    .catch(err => console.log(err));
                  //checknumber
                  axios({
                    method: "get",
                    withCredentials: true,
                    url: "/checkNumberOfAttempt"
                  })
                    .then(respense => {
                      setCheckPass(respense.data);
                    })
                    .catch(err => console.log(err));

                  //getnumber 
                  axios({
                    method: "get",
                    withCredentials: true,
                    url: "/getNumberOfAttempt"
                  })
                    .then(respense => {
                      setNumberOfAttenmt(respense.data.numberOfAttenmt);
                    })
                    .catch(err => console.log(err));
                  //save image 

                  for (let i = 0; i < responseData.newurl.length; i++) {
                    axios({
                      method: "post",
                      data: {
                        imageURL: responseData.newurl[i]
                      },
                      url: "/downloadImage",
                      withCredentials: true,
                    })
                      .then(respense => {
                        const urlSaved = respense.data.newImageUrl;

                        axios({
                          method: "post",
                          data: {
                            url: urlSaved,
                            id_user: userId
                          },
                          url: "/addImage",
                          withCredentials: true,
                        })
                          .then((data) => {
                            //console.log(data.message);
                          })
                          .catch((error) => {
                            console.error(error);
                          });

                      })
                      .catch(err => console.log(err));
                  }
                  // }

                })
                .catch((error) => {
                  console.error('Error:', error);
                  setIsLoading(false);
                  setDisplaybothimage(false);

                });
              incrementAttempt();
              count++;

            } catch (error) {
              console.error('Error creating object URL:', error);
              setIsLoading(false);
              setDisplaybothimage(false);
            }

          }
        } else
          if (imageUrl) {

            if (true) {
              try {
                setDisplaygenimage(true);
                const encodedUrl = encodeURIComponent(imageUrl);
                var image_number;
                var NpromptDesc2;
                var NpromptDesc;
                if (document.getElementById('numberImages') != null) { image_number = document.getElementById('numberImages').value; }
                const promptDesc2 = document.getElementById('desc').value;
                const words = promptDesc2.split(" ");
                const promptDescDispatched = words.join("+");
                const promptDesc = encodeURIComponent(promptDescDispatched);
                if (document.getElementById('NegPro') != null) {
                  NpromptDesc2 = document.getElementById('NegPro').value;
                  const Nwords = NpromptDesc2.split(" ");
                  const NpromptDescDispatched = Nwords.join("+");
                  NpromptDesc = encodeURIComponent(NpromptDescDispatched);
                } else { NpromptDesc = ""; }
                var size;
                var scale;
                if (document.getElementById('size') != null) { size = encodeURIComponent(document.getElementById('size').value); } else { size = "Original"; }
                if (document.getElementById('scale') != null) { scale = document.getElementById('scale').value; } else { scale = 1; }

                fetch(`/api/genbg?url=${encodedUrl}&promptDesc=${promptDesc}&image_number=${image_number}&NpromptDesc=${NpromptDesc}&size=${size}&scale=${scale}`)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                      setDisplaygenimage(false);
                    }
                    return response.json();
                  })
                  .then((responseData) => {
                    setDataGen(responseData.newurl);


                    //save image 

                    for (let i = 0; i < responseData.newurl.length; i++) {
                      axios({
                        method: "post",
                        data: {
                          imageURL: responseData.newurl[i]
                        },
                        url: "/downloadImage",
                        withCredentials: true,
                      })
                        .then(respense => {
                          const urlSaved = respense.data.newImageUrl;

                          axios({
                            method: "post",
                            data: {
                              url: urlSaved,
                              id_user: userId
                            },
                            url: "/addImage",
                            withCredentials: true,
                          })
                            .then((data) => {
                              //console.log(data.message);
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        })
                        .catch(err => console.log(err));

                    }

                    setIsLoading(false);

                    //checksub 
                    axios({
                      method: "get",
                      withCredentials: true,
                      url: "/checkSubscribe"
                    })
                      .then(respense => {
                        const isPro = JSON.stringify(respense.data);
                        setCheckSubscribe(isPro);
                      })
                      .catch(err => console.log(err));
                    //checknumber
                    axios({
                      method: "get",
                      withCredentials: true,
                      url: "/checkNumberOfAttempt"
                    })
                      .then(respense => {
                        setCheckPass(respense.data);
                      })
                      .catch(err => console.log(err));

                    //getnumber 
                    axios({
                      method: "get",
                      withCredentials: true,
                      url: "/getNumberOfAttempt"
                    })
                      .then(respense => {
                        setNumberOfAttenmt(respense.data.numberOfAttenmt);
                      })
                      .catch(err => console.log(err));



                  })
                  .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);


                  });
                setIsLoading(false);
                incrementAttempt();
                count++;
                setDisplaygenimage(false);

              } catch (error) {
                console.error('Error creating object URL:', error);
                setIsLoading(false);
                setDisplaygenimage(false);

              }

            }

          }
      }
    }
  }, [imageUrl, imageUrl2]);


  //display image uploaded
  if (typeof window !== 'undefined') {
    const imageInput = document.getElementById('dropzone-file');
    const imageView = document.getElementById('imageView');
    const imageContainer = document.getElementById('imageContainer');
    const imagePlaceFree = document.getElementById('imagePlaceFree');
    const imagePlaceFilled = document.getElementById('imagePlaceFilled');
    if (imageInput) {
      imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onload = function (e) {
            const imageUrl = e.target.result;
            imagePlaceFree.style.display = 'none';
            imagePlaceFilled.style.display = 'block';
            imageView.src = imageUrl;
            imageContainer.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
  //show and hide more options 
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };




  return (


    <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen p-2">
      <div className="container bg-white p-10 rounded-lg  mx-auto flex-col">
        <h2 className="text-2xl font-semibold">Ai Background Removal and General</h2><br></br>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="w-full">

            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input id="dropzone-file" hidden type="file" onChange={handleFileChange} className="hidden" name="dropzone-file" />
            </label>
            {descError && <p className="text-red-500 text-sm mt-2">{descError}</p>}
            <textarea onChange={(e) => {
              setDescfield(e.target.value);
            }}
              placeholder="Describe image" id="desc" name="desc" className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2" required></textarea>

            <select id="numberImages" name="numberImages" className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2" defaultValue="1">
              <option value="1" disabled hidden>Number of images to generate</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            {isLoading ? (
              <button id="myButton" value="" className="mt-4 w-full items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" >
                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
              </button>
            ) : (
              <button id="myButton" value="" className="mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" >
                Remove/Generate bachground
              </button>
            )}




            <div className="flex flex-col items-center justify-center" hidden >
              <button
                onClick={toggleDetails}
                className="text-indigo-700 py-2 px-4 rounded-md cursor-pointer focus:outline-none"
              >
                {isDetailsVisible ? 'Hide Options' : 'Show More Options'}
              </button>

              {isDetailsVisible && (
                <div className="mt-4 p-4 border rounded-md bg-gray-200">
                  <input placeholder="Negative Prompt" type="text" id="NegPro" name="NegPro" className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2" />
                  <select id="size" name="size" className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2" defaultValue="Original">
                    <option value="Original" disabled hidden>Select size</option>
                    <option value="Original">Original</option>
                    <option value="0.6 * width">0.6 * width</option>
                    <option value="0.5 * width">0.5 * width</option>
                    <option value="0.4 * width">0.4 * width</option>
                    <option value="0.3 * width">0.3 * width</option>
                    <option value="0.2 * width">0.2 * width</option>
                  </select>

                  <input placeholder="Num inference steps example: 20" type="number" id="numberImages" name="numberImages" className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2" />
                  <input placeholder="scale max: 4" type="number" id="scale" name="scale" className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2" min="1" max="4" />

                </div>
              )}
            </div>

          </div>

          <div src="" id="imagePlaceFree" width="100%" className=" bg-slate-100" alt="Processed Image"></div>
          <div className="w-full" id="imagePlaceFilled" hidden>
            <div id="imageContainer">

              <img src="" className="h-auto rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30" id="imageView" width="100%" alt="Processed Image" />


              <div id='displayResults'>


                {data ? (
                  <div className="relative group">
                    <h1 className="text-2xl font-bold mt-8 text-center">Remove background</h1>
                    <img src={data} className="mt-4 h-auto rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30" width="100%" alt="Processed Image" />
                    <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <DownloadButton
                        className="bg-blue-500 text-white flex items-center px-3 py-2 rounded-md mt-2 focus:outline-none"
                        imageUrl={data}
                        fileName="AIBgen_Image.png"
                      >
                      </DownloadButton>
                    </div>
                  </div>
                ) : <div>
                  {!displayrmimage ? (<>
                    <div className="w-full max-w-md mx-auto">
                      <div className="flex justify-center items-center h-48">
                        <div className="animate-spin w-16 h-16 border-t-2 border-blue-500 rounded-full"></div>
                      </div>
                    </div>

                  </>) : null}
                </div>}



                {datagen ? (
                  <div className="">
                    <h1 className="text-2xl font-bold mt-8 text-center">Generate background</h1>
                    {datagen.slice(1).map((url, index) => (
                      <div className="relative group">
                        <div>
                          <img key={index} src={url} className="mt-4 h-auto rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30" width="100%" alt={`Processed Image ${index + 1}`} />
                          <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <DownloadButton
                              key={index}
                              className="bg-blue-500 text-white flex items-center px-3 py-2 rounded-md mt-2 focus:outline-none"
                              imageUrl={url}
                              fileName="AIBgen_Image.png"
                            >
                            </DownloadButton>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                ) : <div>
                  {!displayrenimage ? (<>
                    <div className="w-full max-w-md mx-auto">
                      <div className="flex justify-center items-center h-48">
                        <div className="animate-spin w-16 h-16 border-t-2 border-blue-500 rounded-full"></div>
                      </div>
                    </div>


                  </>) : null}
                </div>}

                {datagen2 ? (
                  <div>
                    <h1 className="text-2xl font-bold mt-8 text-center">Remove and Generate background</h1>
                    {datagen2.slice(1).map((url, index) => (
                      <div className="relative group">
                        <div>
                          <img key={index} src={url} className="mt-4 h-auto rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30" width="100%" alt={`Processed Image ${index + 1}`} />
                          <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <DownloadButton
                              key={index}
                              className="bg-blue-500 text-white flex items-center px-3 py-2 rounded-md mt-2 focus:outline-none"
                              imageUrl={url}
                              fileName="AIBgen_Image.png"
                            >
                            </DownloadButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div>
                  {!displaybothimage ? (<>
                    <div className="w-full max-w-md mx-auto">
                      <div className="flex justify-center items-center h-48">
                        <div className="animate-spin w-16 h-16 border-t-2 border-blue-500 rounded-full"></div>
                      </div>
                    </div>


                  </>) : null}
                </div>}


              </div>

            </div>
          </div>
        </div>



        <div id="myModal" className="modal hidden fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80">
          <div className="modal-content md:w-1/3 mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Do you want to:</h2>

            <div className="mt-2 space-y-2">
              <label htmlFor="checkbox1" className="flex items-center">
                <input type="checkbox" id="checkbox1" name="checkbox1" className="mr-2" onChange={() => setSelectedCheckBox1(!selectedCheckBox1)} />
                <span className="text-gray-700">Remove background</span>
              </label>
              <label htmlFor="checkbox2" className="flex items-center">
                <input type="checkbox" id="checkbox2" name="checkbox2" className="mr-2" onChange={() => setSelectedCheckBox2(!selectedCheckBox2)} />
                <span className="text-gray-700">Generate background</span>
              </label>
            </div>
            <div className="flex justify-end mt-6">
              <button id="generateModelButton" disabled={!selectedCheckBox1 && !selectedCheckBox2} onClick={handleUpload} className="font-bold py-2 px-4 roundedmt-4  items-center  tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded">
                Generate
              </button>
              <button id="closeModal" className="ml-4 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                Close
              </button>
            </div>
          </div>
        </div>





        <div id="showLimiteMessage" className="modal fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80 hidden items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0" hidden>

          <div className="md:w-2/3 mx-auto inline-block  align-center rounded-lg overflow-hidden shadow-xl  transform transition-all sm:my-8 sm:align-middle   bg-white">
            <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900">You have reached the free time limit. </h3>

              <button id="closeModelButton" type="button" className=" text-gray-900 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 ">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6">
                </path></svg><span className="sr-only">Close</span>
              </button>
            </div>

            <div className="justify-center w-auto sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="p-6 space-y-6 flex flex-col relative">
                <p className="text-gray-700 text-left">Need more generations? <b>
                  Upgrade to PRO today
                </b> and generate 100 image per month with $0.19/image only. Save your best generations on the cloud.</p><div className="flex flex-col">
                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7">
                        </path>
                      </svg>
                    </div>
                    <div className="col-span-11 text-l flex font-semibold pl-2">
                      <span className="font-bold">
                        100 images
                      </span>
                    </div>
                  </div>


                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7">
                        </path>
                      </svg>
                    </div>
                    <div className="col-span-11 text-l flex font-semibold pl-2">
                      <span className="font-bold">
                        24/6 Support
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7">
                        </path>
                      </svg>
                    </div>
                    <div className="col-span-11 text-l flex font-semibold pl-2">
                      <span className="font-bold">
                        No Watermark
                      </span>
                    </div>
                  </div>

                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7">
                        </path>
                      </svg>
                    </div>
                    <div className="col-span-11 text-l flex font-semibold pl-2">
                      <span className="font-bold">
                        $0.19/image only
                      </span>
                    </div>
                  </div>



                </div>
                <div className="rounded w-full  flex flex-col   border-solid ">
                  <h3 className="text-3xl p-5 text-left pl-6">Gold</h3>
                  <div className="flex flex-row items-center pt-3 pl-6 pr-10 gap-3 pb-3 text-primary-500">
                    <div className="flex flex-row gap-1 ">
                      <span className="text-base"> $ </span>
                      <p className="text-5xl font-semibold">19</p>
                    </div><p className="font-light text-sm">/ month</p>
                  </div>
                  <div className=" pl-6 pr-10 gap-3 pb-3 text-left">
                    <ul className="text-gray-700 ">
                      <li>No advertisements</li>
                      <li>Commercial usage of photos</li>
                      <li>Premium support</li>
                    </ul>
                  </div></div>
                <a className="w-[200px] plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4 absolute bottom-5" href={checkOutUrll}  >Subscribe</a>


              </div>

              {/**GOLD plan  */}

              <div className="p-6 space-y-6 flex flex-col relative">
                <p className="text-left">Need more generations? <b>
                  Upgrade to GOLD today
                </b> and generate as many images as you want per month. Save your best generations on the cloud.</p><div className="flex flex-col">
                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7">
                        </path>
                      </svg>
                    </div>
                    <div className="col-span-11 text-l flex font-semibold pl-2 flex-grow">
                      <span className="font-bold">
                        Unlimited AI Background Generation for the whole month
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded w-full  flex flex-col   border-solid ">
                  <h3 className="text-3xl p-5 text-left pl-6">Gold</h3>
                  <div className="flex flex-row items-center pt-3 pl-6 pr-10 gap-3 pb-3 text-primary-500">
                    <div className="flex flex-row gap-1">
                      <span className="text-base"> $ </span>
                      <p className="text-5xl font-semibold">49</p>
                    </div><p className="font-light text-sm">/ month</p>
                  </div>
                  <div className=" pl-6 pr-10 gap-3 pb-3 text-left">
                    <ul className="text-gray-700 ">
                      <li>No advertisements</li>
                      <li>Commercial usage of photos</li>
                      <li>Premium support</li>
                    </ul>
                  </div></div>

                <a className="w-[200px] plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4 absolute bottom-5" href={checkOutUrl} >Subscribe</a>
              </div>

            </div>

          </div>
        </div>


      </div>



















      <style>{`

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .footer-content {
          width: 100%;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between; 
          align-items: center; 
          color: gray;
        }

        .footer-links {
          text-decoration: none;
          color: gray;
        } 
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>




    </main>


  );

};
export default UploadImage; 