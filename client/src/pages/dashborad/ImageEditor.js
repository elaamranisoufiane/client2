import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
const modalHeaderButtonClasses =
    "ml-2 text-md outline-none py-1 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";

const ImageEditor = (
    allowColorEditing = true,
    allowFlip = true,
    allowRotate = true,
    allowZoom = true,
    allowAddText = true,
    allowAddFrames = true,
    allowAddImages = true,
    allowAddShapes = true,
    allowAddElements = true,
    allowAddIcons = true,

) => {
    const canvasRef = useRef(null);
    const [imageSrc, setImageSrc] = useState('');
    const [imageName, setImageName] = useState('');
    const [brightnessValue, setBrightnessValue] = useState(100);
    const [contrastValue, setContrastValue] = useState(100);
    const [saturateValue, setSaturateValue] = useState(100);
    const [grayscaleValue, setGrayscaleValue] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [flipHorizontal, setFlipHorizontal] = useState(false);
    const [flipVertical, setFlipVertical] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [file, setFile] = useState(null);
    //text styles
    const [isUnderlined, setIsUnderlined] = useState(true);
    const [isBold, setIsBold] = useState(false);
    const [textAlign, setTextAlign] = useState('left');
    const [isItalic, setIsitalic] = useState(false);
    const [isUppercase, setIsUppercase] = useState(false);
    // to delete 
    //input size modal 
    let [CanvasWidth, setCanvasWidth] = useState(null);
    let [CanvasHeight, setCanvasHeight] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [canvasVisible, setCanvasVisible] = useState(false);


    const createEmptyCanvas = () => {
        setFile(null);
        setCanvasVisible(true);

        //const canvas = canvasRef.current;

        //if (canvas) {
        //const context = canvas.getContext('2d');

        // canvas.width = CanvasWidth;
        // canvas.height = CanvasHeight;

        CanvasWidth = 500;
        CanvasHeight = 500;


        //context.fillStyle = 'red';
        //context.fillRect(0, 0, CanvasWidth, CanvasHeight);
        // }
        closeModal();
    };



    //handle mouse movement
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        setMousePosition({ x, y });
    };

    //Text Editing 
    const [text, setText] = useState('');
    const [textcolor, setColor] = useState('');
    const [fontSize, setFontSize] = useState('');
    const [textPositions, setTextPositions] = useState([]);
    const [font, setFont] = useState();

    const handleCanvasClick = (e) => {

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Prompt the user for text input
        if (text !== null) {
            setText(text);
            setColor(textcolor);
            setFont(font);
            setFontSize(fontSize);
            console.log(x, y);
            setTextPositions([...textPositions, { x, y, text: text }]);
        }

    };


    //
    useEffect(() => {
        if (file) {
            const fileSrc = URL.createObjectURL(file);
            setImageSrc(fileSrc);
            setImageName(file.name);
            return () => {
                URL.revokeObjectURL(fileSrc);
            };
        }
    }, [file]);

    useEffect(() => {
        applyFilter();
    }, [CanvasHeight, CanvasWidth, file, imageSrc, rotate, flipHorizontal, flipVertical, zoom, brightnessValue, contrastValue, saturateValue, grayscaleValue, text, textcolor, textPositions, fontSize]);

    const applyFilter = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            if (canvas && context) {
                const zoomedWidth = image.width * zoom;
                const zoomedHeight = image.height * zoom;
                const translateX = (image.width - zoomedWidth) / 2;
                const translateY = (image.height - zoomedHeight) / 2;
                canvas.width = image.width;
                canvas.height = image.height;

                // if (CanvasHeight && CanvasWidth) {
                //     canvas.width = CanvasHeight;
                //     canvas.height = CanvasWidth;
                // } else {
                //     canvas.width = image.width;
                //     canvas.height = image.height;
                // }


                context.filter = getFilterString();
                context.save();
                if (rotate) {
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    context.translate(centerX, centerY);
                    context.rotate((rotate * Math.PI) / 180);
                    context.translate(-centerX, -centerY);
                }
                if (flipHorizontal) {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }
                if (flipVertical) {
                    context.translate(0, canvas.height);
                    context.scale(1, -1);
                }
                context.translate(translateX, translateY);
                context.scale(zoom, zoom);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                //editing adding text  

                textPositions.forEach(({ x, y, text }) => {
                    context.fillStyle = textcolor || 'black';
                    context.font = `${fontSize}px ${font}`;
                    context.justifyContent = textAlign;
                    context.textTransform = isUppercase ? 'uppercase' : 'none';

                    context.textTransform = 'uppercase';


                    //context.font = `${isBold ? 'bold' : 'normal'} ${isItalic ? 'italic' : 'normal'} ${fontSize}px ${font}`;
                    //context.font = `${isBold ? 'bold' : 'normal'} ${isItalic ? 'italic' : 'normal'} ${isUnderlined ? 'underline' : 'normal'} ${fontSize}px ${font}`;

                    context.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px ${font}`;

                    context.fillText(text, x, y);
                });

                context.restore();
            }
        };
    };

    const getFilterString = () => {
        return `brightness(${brightnessValue}%) contrast(${contrastValue}%) grayscale(${grayscaleValue}%) saturate(${saturateValue}%)`;
    };

    const handleRotateChange = (event) => {
        setRotate(parseInt(event?.target?.value));
    };

    const handleZoomIn = () => {
        setZoom((prevZoom) => prevZoom + 0.1);
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
    };

    const resetImage = () => {
        setBrightnessValue(100);
        setContrastValue(100);
        setSaturateValue(100);
        setGrayscaleValue(0);
        setRotate(0);
        setFlipHorizontal(false);
        setFlipVertical(false);
        setZoom(1);
        setText(null);
        setColor(null);
        setFont('Arial');
        setFontSize(0);


    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    const editedFile = new File([blob], imageName, { type: blob.type });
                    const objectUrl = URL.createObjectURL(blob);

                    const linkElement = document.createElement('a');
                    linkElement.download = `${imageName}`;
                    linkElement.href = objectUrl;
                    linkElement.click();
                    URL.revokeObjectURL(objectUrl);


                }
            });
            resetImage();
        }
    };

    const setFileData = (e) => {
        if (e?.target?.files && e.target.files.length > 0) {
            setCanvasVisible(false);
            setFile(e.target.files[0]);
        }
    };

    //menu animation 
    // to delete 
    const [adjustSubMenuOpen, setAdjustSubMenuOpen] = useState(false);
    const [TextSubMenuOpen, setTextSubMenuOpen] = useState(false);
    const [FramesSubMenuOpen, setFramesSubMenuOpen] = useState(false);
    const [ImagesSubMenuOpen, setImagesSubMenuOpen] = useState(false);
    const [ShapesSubMenuOpen, setShapesSubMenuOpen] = useState(false);
    const [ElementsSubMenuOpen, setElementsSubMenuOpen] = useState(false);
    const [IconsSubMenuOpen, setIconsSubMenuOpen] = useState(false);

    const resetAllSubMenus = () => {
        setAdjustSubMenuOpen(null);
        setTextSubMenuOpen(null);
        setFramesSubMenuOpen(null);
        setImagesSubMenuOpen(null);
        setShapesSubMenuOpen(null);
        setElementsSubMenuOpen(null);
        setIconsSubMenuOpen(null);
        setCanvasVisible(false);
    };



    return (


        <main className="max-w-3/4 flex flex-col items-center p-2">
            <div className="container bg-gray-100 shadow-lg p-11 rounded-lg  mx-auto flex-col h-screen">
                <h2 className="text-2xl font-semibold">Photo Editor</h2>
                <div className="grid grid-cols-12 pb-6">
                    {/* Left side menu */}

                    <div className={`items-center justify-center col-span-1 ml-8  inline-block`}>
                        <span className='text-xl'>Menu </span>

                        {/* Sidebar */}
                        {/**Adjust */}
                        <div className={`p-2 rounded-l-lg ${adjustSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Adjust Menu */}
                            <div>
                                <button
                                    id="tn-adjust"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setAdjustSubMenuOpen(!adjustSubMenuOpen) }}
                                >
                                    <span className="material-icons">
                                        <span className="material-icons flex justify-center items-center">
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14Z" stroke="#1C274C" stroke-width="1.5"></path> <circle cx="2" cy="2" r="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 16 10)" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M14 16L19 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M10 8L5 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M5 16L6 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19 8L18 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                                        </span>
                                        <span className="icon-menu-title">Adjust</span>
                                    </span>
                                </button>
                            </div>

                        </div>
                        <div className={`p-2 rounded-l-lg ${FramesSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Frames Menu */}
                            <div>
                                <button
                                    id="btn-frames"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setFramesSubMenuOpen(!FramesSubMenuOpen) }}
                                >
                                    <span className="material-icons">
                                        <span className="material-icons flex justify-center items-center">
                                            <svg viewBox="0 0 24 24" width="30px" height="30px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.97883 6.31492C2.99294 7.10927 2 7.50645 2 8C2 8.49355 2.99294 8.89073 4.97883 9.68508L7.7873 10.8085C9.77318 11.6028 10.7661 12 12 12C13.2339 12 14.2268 11.6028 16.2127 10.8085L19.0212 9.68508C21.0071 8.89073 22 8.49355 22 8C22 7.50645 21.0071 7.10927 19.0212 6.31492L16.2127 5.19153C14.2268 4.39718 13.2339 4 12 4C11.0461 4 10.2361 4.2374 9 4.71221" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M5.76613 10L4.97883 10.3149C2.99294 11.1093 2 11.5065 2 12C2 12.4935 2.99294 12.8907 4.97883 13.6851L7.7873 14.8085C9.77318 15.6028 10.7661 16 12 16C13.2339 16 14.2268 15.6028 16.2127 14.8085L19.0212 13.6851C21.0071 12.8907 22 12.4935 22 12C22 11.5065 21.0071 11.1093 19.0212 10.3149L18.2339 10" stroke="#1C274C" stroke-width="1.5"></path> <path d="M19.0212 17.6851C21.0071 16.8907 22 16.4935 22 16C22 15.5065 21.0071 15.1093 19.0212 14.3149L18.2339 14M5.76613 14L4.97883 14.3149C2.99294 15.1093 2 15.5065 2 16C2 16.4935 2.99294 16.8907 4.97883 17.6851L7.7873 18.8085C9.77318 19.6028 10.7661 20 12 20C12.9539 20 13.7639 19.7626 15 19.2878" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                                        </span>
                                        <span className="icon-menu-title">Frames</span>
                                    </span>
                                </button>
                            </div>

                        </div>
                        <div className={`p-2 rounded-l-lg ${TextSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Text Menu */}
                            <div>
                                <button
                                    id="btn-text"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setTextSubMenuOpen(!TextSubMenuOpen) }}
                                >
                                    <span className="material-icons min-w-full">
                                        <span className="material-icons flex justify-center items-center ml-2">
                                            <svg viewBox="0 0 24 24" width="32px" height="32px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17H11.25ZM15.25 9.75C15.25 10.1642 15.5858 10.5 16 10.5C16.4142 10.5 16.75 10.1642 16.75 9.75H15.25ZM7.25 9.75C7.25 10.1642 7.58579 10.5 8 10.5C8.41421 10.5 8.75 10.1642 8.75 9.75H7.25ZM15.7071 7.32544L16.2646 6.82371V6.82371L15.7071 7.32544ZM9.5 16.25C9.08579 16.25 8.75 16.5858 8.75 17C8.75 17.4142 9.08579 17.75 9.5 17.75V16.25ZM15 17.75C15.4142 17.75 15.75 17.4142 15.75 17C15.75 16.5858 15.4142 16.25 15 16.25V17.75ZM10 7.75H12V6.25H10V7.75ZM12 7.75H14V6.25H12V7.75ZM12.75 17V7H11.25V17H12.75ZM15.25 9.22222V9.75H16.75V9.22222H15.25ZM7.25 9.22222V9.75H8.75V9.22222H7.25ZM14 7.75C14.4949 7.75 14.7824 7.75196 14.9865 7.78245C15.0783 7.79617 15.121 7.8118 15.1376 7.8194C15.148 7.82415 15.1477 7.82503 15.1496 7.82716L16.2646 6.82371C15.96 6.4853 15.579 6.35432 15.2081 6.29891C14.8676 6.24804 14.4479 6.25 14 6.25V7.75ZM16.75 9.22222C16.75 8.71757 16.7513 8.27109 16.708 7.91294C16.6629 7.54061 16.559 7.15082 16.2646 6.82371L15.1496 7.82716C15.1523 7.83015 15.1609 7.83939 15.1731 7.87221C15.1873 7.91048 15.2048 7.97725 15.2188 8.09313C15.2487 8.34011 15.25 8.67931 15.25 9.22222H16.75ZM10 6.25C9.55208 6.25 9.13244 6.24804 8.79192 6.29891C8.42102 6.35432 8.04 6.4853 7.73542 6.82371L8.85036 7.82716C8.85228 7.82503 8.85204 7.82415 8.86242 7.8194C8.87904 7.8118 8.92168 7.79617 9.01354 7.78245C9.21765 7.75196 9.50511 7.75 10 7.75V6.25ZM8.75 9.22222C8.75 8.67931 8.75129 8.34011 8.78118 8.09313C8.7952 7.97725 8.81273 7.91048 8.8269 7.87221C8.83905 7.83939 8.84767 7.83015 8.85036 7.82716L7.73542 6.82371C7.44103 7.15082 7.3371 7.54061 7.29204 7.91294C7.24871 8.27109 7.25 8.71757 7.25 9.22222H8.75ZM9.5 17.75H15V16.25H9.5V17.75Z" fill="#1C274C"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                                        </span>
                                        <span className="icon-menu-title ml-2"> Text</span>
                                    </span>
                                </button>
                            </div>

                        </div>

                        <div className={`p-2 rounded-l-lg ${ImagesSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Image Menu */}
                            <div>
                                <button
                                    id="btn-image"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setImagesSubMenuOpen(!ImagesSubMenuOpen) }}
                                >
                                    <span className="material-icons">
                                        <span className="material-icons flex justify-center items-center">
                                            <svg viewBox="0 0 24 24" width="30px" height="30px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 5.5H18.5M18.5 5.5H22M18.5 5.5V9M18.5 5.5V2" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 10.8717 2 9.87835 2.02008 9M12 2C7.28595 2 4.92893 2 3.46447 3.46447C3.03965 3.88929 2.73806 4.38921 2.52396 5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                                        </span>
                                        <span className="icon-menu-title">Images</span>
                                    </span>
                                </button>
                            </div>

                        </div>

                        <div className={`p-2 rounded-l-lg ${ShapesSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Shapes Menu */}
                            <div>
                                <button
                                    id="btn-shape"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setShapesSubMenuOpen(!ShapesSubMenuOpen) }}
                                >
                                    <span className="material-icons">
                                        <span className="material-icons flex justify-center items-center">
                                            <svg width="30px" height="30px" viewBox="0 -17 158 158" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0)"> <path d="M46.1334 81.5231C40.3511 81.5231 34.6807 81.4698 29.0124 81.538C23.107 81.6094 17.203 81.8529 11.2975 81.9022C9.40462 81.9009 7.51658 81.7113 5.66129 81.3367C0.962363 80.4278 -0.372013 77.4018 2.18168 73.3053C3.9406 70.4806 5.89063 67.7636 7.87234 65.0843C18.579 50.6037 29.3514 36.1717 40.0353 21.674C43.1329 17.4697 46.0534 13.133 48.9654 8.79693C49.7995 7.49357 50.492 6.10548 51.0317 4.65618C52.7287 0.362918 56.5586 -0.677117 59.9911 2.39042C61.1972 3.53961 62.2996 4.79222 63.2855 6.13379C69.7361 14.3572 76.1718 22.5925 82.5932 30.8397C82.9971 31.3591 83.4642 31.8239 83.9977 32.4211C91.0419 27.6835 99.1036 24.6593 107.534 23.5918C124.813 21.3358 138.363 27.3203 147.816 41.9938C152.556 49.3507 155.894 57.2835 156.852 66.0919C158.354 79.9266 154.482 92.2065 145.103 102.323C131.803 116.67 115.006 124.114 95.3858 123.603C78.4402 123.162 65.2358 114.987 55.7773 101.051C51.9129 95.3591 48.4544 89.3792 46.6812 82.617C46.54 82.2333 46.3564 81.8665 46.1334 81.5231ZM56.8432 81.2355C57.7618 83.3668 58.4068 85.2489 59.3514 86.968C60.8578 89.8142 62.5199 92.5753 64.3305 95.2397C70.91 104.603 79.7359 110.84 91.2803 111.874C109.903 113.544 125.612 107.026 138.23 93.3511C142.851 88.2859 145.65 81.8327 146.185 75.0075C147.492 61.1397 142.35 49.6078 132.704 39.8761C129.381 36.5274 125.127 34.881 120.62 33.8572C113.593 32.2601 106.668 33.143 99.8261 34.9712C95.9701 35.8825 92.2829 37.3967 88.9025 39.4573C89.7631 40.7285 90.4888 41.8224 91.236 42.9014C96.9297 51.1257 102.5 59.4271 106.815 68.4803C107.814 70.4578 108.63 72.5224 109.252 74.6479C110.629 79.8117 108.001 82.6702 102.629 82.4631C88.4927 81.9178 74.3484 81.5036 60.2068 81.0576C59.2315 81.0219 58.2504 81.1556 56.8432 81.2355ZM98.3681 74.0636C86.113 51.0815 69.9811 32.1186 53.9756 12.6519C41.1173 33.9039 26.0219 53.396 11.3303 74.1908C40.6411 73.241 69.1316 72.4522 98.3655 74.0636H98.3681Z" fill="#000000"></path> </g> <defs> <clipPath id="clip0"> <rect width="157" height="124" fill="white" transform="translate(0.777344)"></rect> </clipPath> </defs> </g></svg>

                                        </span>
                                        <span className="icon-menu-title">Shapes</span>
                                    </span>
                                </button>
                            </div>

                        </div>

                        <div className={`p-2 pl-0 rounded-l-lg ${ElementsSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Elements Menu */}
                            <div>
                                <button
                                    id="btn-elements"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setElementsSubMenuOpen(!ElementsSubMenuOpen) }}
                                >
                                    <span className="material-icons">
                                        <span className="material-icons flex justify-center items-center">
                                            <svg viewBox="0 0 24 24" width="30px" height="30px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.03954 7.77203C3.57986 8.32856 2.35002 8.60682 2.05742 9.54773C1.76482 10.4886 2.60325 11.4691 4.2801 13.4299L4.71392 13.9372C5.19043 14.4944 5.42868 14.773 5.53586 15.1177C5.64305 15.4624 5.60703 15.8341 5.53498 16.5776L5.4694 17.2544C5.21588 19.8706 5.08912 21.1787 5.85515 21.7602C6.62118 22.3417 7.77268 21.8115 10.0757 20.7512L10.6715 20.4768C11.3259 20.1755 11.6531 20.0248 12 20.0248C12.3469 20.0248 12.6741 20.1755 13.3285 20.4768L13.9243 20.7512C16.2273 21.8115 17.3788 22.3417 18.1449 21.7602C18.9109 21.1787 18.7841 19.8706 18.5306 17.2544M19.7199 13.4299C21.3968 11.4691 22.2352 10.4886 21.9426 9.54773C21.65 8.60682 20.4201 8.32856 17.9605 7.77203L17.3241 7.62805C16.6251 7.4699 16.2757 7.39083 15.9951 7.17781C15.7144 6.96479 15.5345 6.64193 15.1745 5.99623L14.8468 5.40837C13.5802 3.13612 12.9469 2 12 2C11.0531 2 10.4198 3.13613 9.15316 5.40838" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>

                                        </span>
                                        <span className="icon-menu-title">Elements</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className={`p-2 rounded-l-lg ${IconsSubMenuOpen ? 'bg-white' : 'bg-transparent'}`}>
                            {/* Icons Menu */}
                            <div>
                                <button
                                    id="btn-elements"
                                    type="button"
                                    onClick={() => { resetAllSubMenus(); setIconsSubMenuOpen(!IconsSubMenuOpen) }}
                                >
                                    <span className="material-icons">
                                        <span className="material-icons flex justify-center items-center">
                                            <svg viewBox="0 0 24 24" width="30px" height="30px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16 10.5C16 11.3284 15.5523 12 15 12C14.4477 12 14 11.3284 14 10.5C14 9.67157 14.4477 9 15 9C15.5523 9 16 9.67157 16 10.5Z" fill="#1C274C"></path> <ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill="#1C274C"></ellipse> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                                        </span>
                                        <span className="icon-menu-title">Icons</span>
                                    </span>
                                </button>
                            </div>

                        </div>


                    </div>
                    {adjustSubMenuOpen && (

                        <div className={`col-span-3 bg-white rounded-r-lg p-5 space-x-4`}>

                            <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md">

                                <div className="mb-4">

                                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                                        Basic Adjust
                                    </label>

                                    <div className="max-w-md mx-auto  bg-gray-100 rounded-md shadow-md gap-2">

                                        {/** Rotate */}
                                        {allowRotate && (
                                            <div className="flex flex-row items-center mb-4">
                                                <label className="text-xs font-medium">Rotate:</label>
                                                <input
                                                    type="range"
                                                    value={rotate}
                                                    step="1"
                                                    onChange={handleRotateChange}
                                                    min={-180}
                                                    max={180}
                                                    className="ml-[1.8rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                />
                                                <input
                                                    type="number"
                                                    value={rotate}
                                                    onChange={handleRotateChange}
                                                    className="w-14 pl-1 rounded-md text-right"
                                                />
                                            </div>
                                        )}

                                        {/** Color Editing */}
                                        {allowColorEditing && (
                                            <>
                                                <div className="flex flex-row justify-between items-center mb-4" data-testid="color-editing">
                                                    <label className="text-xs font-medium text-gray-900 dark:text-white">Brightness:</label>
                                                    <input
                                                        id="brightness-range"
                                                        type="range"
                                                        step="1"
                                                        max={200}
                                                        value={brightnessValue}
                                                        onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                                                        className="ml-2 w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={brightnessValue}
                                                        onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                                                        className="w-14 pl-1 rounded-md text-right"
                                                    />
                                                </div>

                                                <div className="flex items-center mb-4">
                                                    <label className="text-xs font-medium text-gray-900 dark:text-white">Contrast:</label>
                                                    <input
                                                        id="contrast-range"
                                                        type="range"
                                                        step="1"
                                                        max={200}
                                                        value={contrastValue}
                                                        onChange={(e) => setContrastValue(parseInt(e.target.value))}
                                                        className="ml-[1.1rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={contrastValue}
                                                        onChange={(e) => setContrastValue(parseInt(e.target.value))}
                                                        className="w-14 pl-1 rounded-md text-right"
                                                    />
                                                </div>

                                                <div className="flex items-center mb-4">
                                                    <label className="text-xs font-medium text-gray-900 dark:text-white">Saturate:</label>
                                                    <input
                                                        id="saturate-range"
                                                        type="range"
                                                        step="1"
                                                        max={200}
                                                        value={saturateValue}
                                                        onChange={(e) => setSaturateValue(parseInt(e.target.value))}
                                                        className="ml-[1.2rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={saturateValue}
                                                        onChange={(e) => setSaturateValue(parseInt(e.target.value))}
                                                        className="w-14 pl-1 rounded-md text-right"
                                                    />
                                                </div>

                                                <div className="flex items-center mb-4">
                                                    <label className="text-xs font-medium text-gray-900 dark:text-white">Grayscale:</label>
                                                    <input
                                                        id="grayscale-range"
                                                        type="range"
                                                        value={grayscaleValue}
                                                        max="100"
                                                        onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                                                        className="ml-[0.8rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={grayscaleValue}
                                                        onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                                                        className="w-14 pl-1 rounded-md text-right"
                                                    />
                                                </div>
                                            </>
                                        )}

                                    </div>

                                    {/** Resize */}
                                    <div className='max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md '>
                                        <a href="#">
                                            <span className="flex">
                                                <svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path d="M19,3 C20.5976809,3 21.9036609,4.24891996 21.9949073,5.82372721 L22,6 L22,18 C22,19.5976809 20.75108,20.9036609 19.1762728,20.9949073 L19,21 L5,21 C3.40231912,21 2.09633912,19.75108 2.00509269,18.1762728 L2,18 L2,6 C2,4.40231912 3.24891996,3.09633912 4.82372721,3.00509269 L5,3 L19,3 Z M19,5 L5,5 C4.48716416,5 4.06449284,5.38604019 4.00672773,5.88337887 L4,6 L4,18 C4,18.5128358 4.38604019,18.9355072 4.88337887,18.9932723 L5,19 L19,19 C19.5128358,19 19.9355072,18.6139598 19.9932723,18.1166211 L20,18 L20,6 C20,5.48716416 19.6139598,5.06449284 19.1166211,5.00672773 L19,5 Z M17,12 C17.5128358,12 17.9355072,12.3860402 17.9932723,12.8833789 L18,13 L18,16 C18,16.5128358 17.6139598,16.9355072 17.1166211,16.9932723 L17,17 L14,17 C13.4477153,17 13,16.5522847 13,16 C13,15.4871642 13.3860402,15.0644928 13.8833789,15.0067277 L14,15 L16,15 L16,13 C16,12.4871642 16.3860402,12.0644928 16.8833789,12.0067277 L17,12 Z M10,7 C10.5522847,7 11,7.44771525 11,8 C11,8.51283584 10.6139598,8.93550716 10.1166211,8.99327227 L10,9 L8,9 L8,11 C8,11.5128358 7.61395981,11.9355072 7.11662113,11.9932723 L7,12 C6.48716416,12 6.06449284,11.6139598 6.00672773,11.1166211 L6,11 L6,8 C6,7.48716416 6.38604019,7.06449284 6.88337887,7.00672773 L7,7 L10,7 Z"></path>
                                                    </g>
                                                </svg>
                                                Resize
                                            </span>
                                        </a>

                                        <div className="resize-wrap">
                                            <div className='flex'>
                                                <input id="resize-width rounded" className="w-1/3 bg-slate-200" type="number" autoComplete="off" />
                                                <span className=""> X </span>
                                                <input id="resize-height rounded" className="w-1/3 bg-slate-200" type="number" data-size="" autoComplete="off" />
                                            </div>
                                        </div>

                                        <button id="resize-apply" type="button" className="bg-slate-700 hover:bg-slate-500 font-bold m-1 p-1 w-full rounded">
                                            Apply
                                        </button>

                                    </div>


                                </div>


                                <hr className="my-4 border-t" />

                            </div>


                        </div>


                    )}
                    {/** text */}
                    {(allowAddText && TextSubMenuOpen) && (
                        <div className={`col-span-3 bg-white rounded-r-lg p-5 space-x-4`}>

                            <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md">

                                <div className="mb-4">

                                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                                        Enter Text
                                    </label>


                                    <div className="control-wrap label-block">
                                        <div className="control">

                                            <div id="text-format-btns" className="btn-group icon-group">

                                                <button id="format-uppercase" type="button" className={`btn ${isUppercase ? 'bg-slate-500' : ''}`} >
                                                    <span className="material-icons"><svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16,6a1,1,0,0,0-1-1H3A1,1,0,0,0,3,7H8V18a1,1,0,0,0,2,0V7h5A1,1,0,0,0,16,6Zm5,5H15a1,1,0,0,0,0,2h2v5a1,1,0,0,0,2,0V13h2a1,1,0,0,0,0-2Z"></path></g></svg></span>
                                                </button>

                                                <button id="format-bold" type="button" className={`btn ${isBold ? 'bg-slate-500' : ''}`}>
                                                    <span className="material-icons"><svg viewBox="0 0 24 24" width="24px" height="24px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 6.5V18H13C14.6569 18 16 16.6569 16 15V15C16 13.3431 14.6569 12 13 12H8H12.25C13.7688 12 15 10.7688 15 9.25V9.25C15 7.73122 13.7688 6.5 12.25 6.5H8Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                                                </button>

                                                <button id="format-italic" type="button" className={`btn ${isItalic ? 'bg-slate-500' : ''}`}  >
                                                    <span className="material-icons"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 6L10 18M6 18H14M10 6H18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                                                </button>

                                                <button id="format-underlined" type="button" className={`btn ${isUnderlined ? 'bg-slate-500' : ''}`} >
                                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 4V11C7 13.7614 9.23858 16 12 16C14.7614 16 17 13.7614 17 11V4M6 20H18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                </button>

                                                <button id="format-align-left" type="button" className={`btn format-align  ${textAlign === 'left' ? 'bg-slate-500' : ''}`} >
                                                    <span className="material-icons"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4H20M4 12H20M4 20H20M4 8H14M4 16H14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                                                </button>

                                                <button id="format-align-center" type="button" className={`btn format-align ${textAlign === 'center' ? 'bg-slate-500' : ''}`} >
                                                    <span className="material-icons"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4H20M4 12H20M4 20H20M7 8H17M7 16H17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                                                </button>

                                                <button id="format-align-right" type="button" className={`btn format-align ${textAlign === 'right' ? 'bg-slate-500' : ''}`}>
                                                    <span className="material-icons"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4H20M4 12H20M4 20H20M10 8H20M10 16H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                                                </button>

                                                <button id="format-align-justify" type="button" className={`btn format-align ${textAlign === 'justify' ? 'bg-slate-500' : ''}`} >
                                                    <span className="material-icons"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4H20M4 12H20M4 20H20M4 8H20M4 16H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                                                </button>

                                            </div>
                                        </div>
                                    </div>


                                    <textarea
                                        id="text-input"
                                        placeholder="Enter text"
                                        value={text}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                        onChange={(e) => setText(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="font-size-input" className="block text-sm font-medium text-gray-700">
                                        Font Size
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Font Size"
                                        value={fontSize}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                        onChange={(e) => setFontSize(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="color-input" className="block text-sm font-medium">
                                        Text Color
                                    </label>
                                    <input
                                        type="color"
                                        value={textcolor}
                                        className="w-full "
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>


                                <div className="mb-4">
                                    <label htmlFor="font-select" className="block text-sm font-medium text-gray-700">
                                        Font Family
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                        value={font}
                                        onChange={(e) => setFont(e.target.value)}
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Palatino">Palatino</option>
                                        <option value="Garamond">Garamond</option>
                                        <option value="Bookman">Bookman</option>
                                        <option value="Comic Sans MS">Comic Sans MS</option>
                                        <option value="Trebuchet MS">Trebuchet MS</option>
                                        <option value="Arial Black">Arial Black</option>
                                    </select>
                                </div>

                                <hr className="my-4 border-t" />

                            </div>


                        </div>
                    )}

                    {(allowAddFrames && FramesSubMenuOpen) && (
                        <div className={`col-span-3 bg-white rounded-r-lg p-5 space-x-4`}>

                            <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md">

                                <div className="mb-4">

                                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                                        Frames options
                                    </label>

                                    <div className="max-w-md mx-auto  bg-gray-100 rounded-md shadow-md gap-2">
                                        .....
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}

                    {(allowAddImages && ImagesSubMenuOpen) && (
                        <div className="col-span-3 bg-white rounded-r-lg p-5 space-x-4">
                            <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md">
                                <div className="mb-4">
                                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                                        Image options
                                    </label>

                                    <div id="image-options" className="image-options-panel-content panel-hide">
                                        <div className="image-tabs">
                                            <ul className="image-tabs-menu">
                                                <li data-target="#image-overlay-image-mode">Overlay Image</li>
                                            </ul>
                                            <div id="image-image-mode" className="image-tab active">
                                                {/* Upload Image Button */}

                                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center pt-1 pb-1">
                                                        <svg className="w-8 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                        </svg>
                                                        <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id="dropzone-file"
                                                        accept="image/*"
                                                        onChange={(e) => setFileData(e)}
                                                        multiple={false}
                                                        className="hidden"
                                                    />
                                                </label>

                                                <br />
                                                {/* Media Library Button */}
                                                <button
                                                    id="image-media-library"
                                                    type="button"
                                                    className="image-btn primary image-lg-btn btn-full image-modal-open"
                                                    data-target="#modal-media-library"
                                                >
                                                    <span className="material-icons">photo_library</span>
                                                    Select From Media Library
                                                </button>

                                                {/* Image Settings */}
                                                <div id="image-settings" className="image-sub-settings">
                                                    <div className="image-control-wrap">
                                                        <label className="image-control-label">Image Filter</label>
                                                        <div className="image-control">
                                                            <select id="image-filter" className="image-select" autoComplete="off">
                                                                <option value="none" selected>
                                                                    None
                                                                </option>
                                                                <option value="grayscale">Grayscale</option>
                                                                <option value="sepia">Sepia</option>
                                                                {/* Add more options as needed */}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {/* Add more settings as needed */}
                                                    <hr />
                                                    <div className="image-control-wrap label-block">
                                                        <div className="image-control">
                                                            <div className="image-btn-group icon-group">
                                                                <button
                                                                    id="flip-horizontal"
                                                                    type="button"
                                                                    className="image-btn tooltip tooltip-top"
                                                                    data-title="Flip X"
                                                                >
                                                                    <span className="material-icons">flip</span>
                                                                </button>
                                                                <button
                                                                    id="flip-vertical"
                                                                    type="button"
                                                                    className="image-btn tooltip tooltip-top"
                                                                    data-title="Flip Y"
                                                                >
                                                                    <span className="material-icons">flip</span>
                                                                </button>
                                                                {/* Add more buttons with Material Icons as needed */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Add more controls as needed */}
                                                </div>
                                            </div>
                                            <div id="image-overlay-image-mode" className="image-tab"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>




                    )}
                    {(allowAddShapes && ShapesSubMenuOpen) && (
                        <div className={`col-span-3 bg-white rounded-r-lg p-5 space-x-4`}>

                            <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md">

                                <div className="mb-4">

                                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                                        Shapes options
                                    </label>


                                    <div className="max-w-md mx-auto  bg-gray-100 rounded-md shadow-md gap-2">

                                        <div id="all-shapes" class="tab active">

                                            <div id="shapes-grid" class="shapes-grid four-column grid grid-cols-3">


                                                <div className="shape relative" data-id="circle" title="Circle">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(1.97 0 0 1.97 100 100)" id="1703336786828">
                                                            <circle
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                cx="0"
                                                                cy="0"
                                                                r="50"
                                                            ></circle>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="ellipse" title="Ellipse">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(1.28 0 0 1.28 100 100)" id="1703336889308">
                                                            <ellipse
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                cx="0"
                                                                cy="0"
                                                                rx="75"
                                                                ry="50"
                                                            ></ellipse>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="square" title="Square">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(1.92 0 0 1.92 100 100)" id="1703336967063">
                                                            <rect
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                x="-50"
                                                                y="-50"
                                                                rx="0"
                                                                ry="0"
                                                                width="100"
                                                                height="100"
                                                            ></rect>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="rectangle" title="Rectangle">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(0.96 0 0 0.96 100 100)" id="1703336994136">
                                                            <rect
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                x="-100"
                                                                y="-75"
                                                                rx="0"
                                                                ry="0"
                                                                className="isolation-isolate w-1/2 h-full m-2"
                                                                height="150"
                                                            ></rect>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="triangle" title="Triangle">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(1.9 0 0 1.9 100 100)" id="1703337022890">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-50 50,0 -50,50 50"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="trapezoid" title="Trapezoid">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(0.64 0 0 0.64 100 100)" id="1703337057514">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-100,-50 100,-50 150,50 -150,50"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="pentagon" title="Pentagon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(2.49 0 0 2.49 100 100)" id="1703337099944">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-24,36.9 -38.8,-8.7 0,-36.9 38.8,-8.7 24,36.9"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="octagon" title="Octagon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(2.55 0 0 2.55 100 100)" id="1703337143397">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-15.5,37.4 -37.4,15.5 -37.4,-15.5 -15.5,-37.4 15.5,-37.4 37.4,-15.5 37.4,15.5 15.5,37.4"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="emerald" title="Emerald">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(0.77 0 0 0.77 100 100)" id="1703337170338">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="0,-125 108,-62.5 108,62.5 0,125 -108,62.5 -108,-62.5"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div>

                                                <div className="shape relative" data-id="star" title="Star">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(0.81 0 0 0.81 100 100)" id="1703337202278">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-0.5,-113 29.5,-28 119.5,-28 49.5,27 72.5,113 -0.5,62 -73.5,113 -47.5,27 -119.5,-27 -29.5,-27"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div >

                                                <div className="shape relative" data-id="diamond" title="Diamond">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(1.01 0 0 1.01 100 100)" id="1703344442320">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-55.56,0 0,-96.23 55.56,0 0,96.23"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div >

                                                <div className="shape relative" data-id="parallelogram" title="Parallelogram">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        version="1.1"
                                                        className="isolation-isolate w-1/2 h-full m-2"

                                                        viewBox="0 0 200 200"
                                                        xmlSpace="preserve"
                                                    >
                                                        <g transform="matrix(3.91 0 0 3.91 100 100)" id="1703343656588">
                                                            <polygon
                                                                style={{
                                                                    stroke: 'rgb(0,0,0)',
                                                                    strokeWidth: 0,
                                                                    strokeDasharray: 'none',
                                                                    strokeLinecap: 'butt',
                                                                    strokeDashoffset: 0,
                                                                    strokeLinejoin: 'miter',
                                                                    strokeMiterlimit: 4,
                                                                    fill: 'rgb(0,0,0)',
                                                                    fillRule: 'nonzero',
                                                                    opacity: 1,
                                                                }}
                                                                vectorEffect="non-scaling-stroke"
                                                                points="-15,-5 25,-5 15,5 -25,5"
                                                            ></polygon>
                                                        </g>
                                                    </svg>
                                                </div >

                                                <div className="shape" data-id="customShape" title="Custom Shape">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        style={{ isolation: 'isolate' }}
                                                        viewBox="635.423 319.15 189.923 253.893"
                                                        className="isolation-isolate w-1/2 h-full m-2"
                                                    >
                                                        <path
                                                            d="M 741.11 569.194 C 734.865 574.335 725.888 574.321 719.643 569.18 C 694.723 548.667 659.883 523.204 643.966 511.714 C 638.598 507.84 635.423 501.619 635.423 494.999 C 635.423 469.203 635.423 402.088 635.423 359.49 C 635.423 353.881 638.236 348.645 642.908 345.541 C 695.868 310.353 764.9 310.353 817.86 345.541 C 822.524 348.641 825.346 353.89 825.346 359.49 C 825.346 402.089 825.346 469.203 825.346 494.999 C 825.346 501.609 822.163 507.846 816.803 511.714 C 800.882 523.207 766.031 548.678 741.11 569.194 Z "
                                                            fill="rgb(0,0,0)"
                                                        ></path>
                                                    </svg>
                                                </div >



                                            </div>

                                        </div>

                                    </div>
                                </div>


                            </div>
                        </div>

                    )}
                    {
                        (allowAddElements && ElementsSubMenuOpen) && (
                            <div className={`col-span-3 bg-white rounded-r-lg`}>
                                <div className='p-4'>
                                    <h3 className='text-base'>Elements Options : </h3>
                                    <div className="flex items-center">
                                        Elements Options
                                    </div>

                                </div>
                            </div>
                        )
                    }
                    {
                        (allowAddIcons && IconsSubMenuOpen) && (
                            <div className={`col-span-3 bg-white rounded-r-lg`}>
                                <div className='p-4'>
                                    <h3 className='text-base'>Icons Options : </h3>
                                    <div className="flex items-center">
                                        Icons Options
                                    </div>

                                </div>
                            </div>
                        )
                    }

                    {/* Main content */}
                    <div className={`flex flex-col items-center justify-center p-4 ${(adjustSubMenuOpen || TextSubMenuOpen || FramesSubMenuOpen || ImagesSubMenuOpen || ShapesSubMenuOpen || ElementsSubMenuOpen || IconsSubMenuOpen) ? 'col-span-8' : 'col-span-11'}`}>

                        {!file && !canvasVisible ? (
                            <div className='grid grid-cols-2 w-full gap-3'>

                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
                                    </div>
                                    <input type="file" id="dropzone-file" accept="image/*" onChange={(e) => setFileData(e)} multiple={false} className="hidden" />
                                </label>

                                <button onClick={openModal}>
                                    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">

                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M3,18H7.382L6.105,20.553a1,1,0,0,0,1.79.894L9.618,18H11v2a1,1,0,0,0,2,0V18h1.382l1.723,3.447a1,1,0,1,0,1.79-.894L16.618,18H21a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H13V3a1,1,0,0,0-2,0V4H3A1,1,0,0,0,2,5V17A1,1,0,0,0,3,18ZM4,6H20V16H4Z"></path></g></svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Create New Blank Canvas</span> </p>
                                        </div>
                                    </div>
                                </button>

                            </div>

                        ) : !file && canvasVisible ? (
                            <>
                                <div className='relative'>
                                    <div className='absolute -right-12'>
                                        <div className="opacity-60">
                                            <button className={modalHeaderButtonClasses} onClick={() => { setFile(null); setCanvasVisible(null) }} data-testid="save-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-rotate-ccw dark:stroke-slate-200"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                                            </button>
                                        </div>

                                        <div className="opacity-60">
                                            <button className={modalHeaderButtonClasses} onClick={() => saveImage()} data-testid="save-button">
                                                <div>
                                                    <svg
                                                        width="30"
                                                        height="30"
                                                        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="#1C274C"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z" fill="#1C274C"></path> </g></svg>

                                                </div>
                                            </button>
                                        </div>
                                    </div>


                                    <canvas
                                        // className="canvas max-w-full max-h-96 object-fit mx-auto"
                                        // data-testid="image-editor-canvas"
                                        // id="canvas"
                                        onMouseMove={handleMouseMove}
                                        onClick={handleCanvasClick}
                                        ref={canvasRef}
                                        // width={800}
                                        // height={600}
                                        style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}

                                    />


                                    <div className='absolute -bottom-6 right-0 bg-white rounded-lg opacity-80'>
                                        <span>X: {mousePosition.x}, Y: {mousePosition.y} </span>
                                    </div>

                                </div>


                                <div className="flex justify-center">
                                    <div className="mb-1 absolute bottom-0 mt-2">

                                        <button className="mx-1  focus:ring-4 rounded-md p-1" onClick={resetImage}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="lucide lucide-rotate-ccw dark:stroke-slate-200"
                                            >
                                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                <path d="M3 3v5h5" />
                                            </svg>
                                        </button>
                                        {allowFlip && (
                                            <div className="inline-block" data-testid="flip-btns">
                                                <button className="mx-1 focus:ring-4 rounded-md p-1" onClick={() => setFlipHorizontal(!flipHorizontal)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-flip-horizontal dark:stroke-slate-200"
                                                    >
                                                        <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
                                                        <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
                                                        <path d="M12 20v2" />
                                                        <path d="M12 14v2" />
                                                        <path d="M12 8v2" />
                                                        <path d="M12 2v2" />
                                                    </svg>
                                                </button>
                                                <button className="mx-1 focus:ring-4 rounded-md p-1" onClick={() => setFlipVertical(!flipVertical)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-flip-vertical dark:stroke-slate-200"
                                                    >
                                                        <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                                                        <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                                                        <path d="M4 12H2" />
                                                        <path d="M10 12H8" />
                                                        <path d="M16 12h-2" />
                                                        <path d="M22 12h-2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        {allowZoom && (
                                            <div className="inline-block" data-testid="zoom-btns">
                                                <button data-testid="zoom-in" className="mx-1 focus:ring-4 rounded-md p-1" onClick={handleZoomIn}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-zoom-in dark:stroke-slate-200"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                        <line x1="11" x2="11" y1="8" y2="14" />
                                                        <line x1="8" x2="14" y1="11" y2="11" />
                                                    </svg>
                                                </button>
                                                <button data-testid="zoom-out" className="mx-1 focus:ring-4 rounded-md p-1" onClick={handleZoomOut}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-zoom-out dark:stroke-slate-200"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                        <line x1="8" x2="14" y1="11" y2="11" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : !canvasVisible && file ? (
                            <>
                                <div className='relative'>
                                    <div className='absolute -right-12'>
                                        <div className="opacity-60">
                                            <button className={modalHeaderButtonClasses} onClick={() => { setFile(null); setCanvasVisible(null) }} data-testid="save-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-rotate-ccw dark:stroke-slate-200"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                                            </button>
                                        </div>

                                        <div className="opacity-60">
                                            <button className={modalHeaderButtonClasses} onClick={() => saveImage()} data-testid="save-button">
                                                <div>
                                                    <svg
                                                        width="30"
                                                        height="30"
                                                        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="#1C274C"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z" fill="#1C274C"></path> </g></svg>

                                                </div>
                                            </button>
                                        </div>
                                    </div>


                                    <canvas
                                        className="canvas max-w-full max-h-96 object-fit mx-auto"
                                        data-testid="image-editor-canvas"
                                        id="canvas"
                                        onMouseMove={handleMouseMove}
                                        onClick={handleCanvasClick}
                                        ref={canvasRef} />

                                    <div className='absolute -bottom-6 right-0 bg-white rounded-lg opacity-80'>
                                        <span>X: {mousePosition.x}, Y: {mousePosition.y} </span>
                                    </div>

                                </div>


                                <div className="flex justify-center">
                                    <div className="mb-1 absolute bottom-0 mt-2">

                                        <button className="mx-1  focus:ring-4 rounded-md p-1" onClick={resetImage}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="lucide lucide-rotate-ccw dark:stroke-slate-200"
                                            >
                                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                <path d="M3 3v5h5" />
                                            </svg>
                                        </button>
                                        {allowFlip && (
                                            <div className="inline-block" data-testid="flip-btns">
                                                <button className="mx-1 focus:ring-4 rounded-md p-1" onClick={() => setFlipHorizontal(!flipHorizontal)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-flip-horizontal dark:stroke-slate-200"
                                                    >
                                                        <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
                                                        <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
                                                        <path d="M12 20v2" />
                                                        <path d="M12 14v2" />
                                                        <path d="M12 8v2" />
                                                        <path d="M12 2v2" />
                                                    </svg>
                                                </button>
                                                <button className="mx-1 focus:ring-4 rounded-md p-1" onClick={() => setFlipVertical(!flipVertical)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-flip-vertical dark:stroke-slate-200"
                                                    >
                                                        <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                                                        <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                                                        <path d="M4 12H2" />
                                                        <path d="M10 12H8" />
                                                        <path d="M16 12h-2" />
                                                        <path d="M22 12h-2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        {allowZoom && (
                                            <div className="inline-block" data-testid="zoom-btns">
                                                <button data-testid="zoom-in" className="mx-1 focus:ring-4 rounded-md p-1" onClick={handleZoomIn}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-zoom-in dark:stroke-slate-200"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                        <line x1="11" x2="11" y1="8" y2="14" />
                                                        <line x1="8" x2="14" y1="11" y2="11" />
                                                    </svg>
                                                </button>
                                                <button data-testid="zoom-out" className="mx-1 focus:ring-4 rounded-md p-1" onClick={handleZoomOut}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-zoom-out dark:stroke-slate-200"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                        <line x1="8" x2="14" y1="11" y2="11" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>


                </div >

            </div >

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="relative w-96 mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold">Canvas Size</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                Close
                            </button>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Width:</label>
                            <input
                                type="number"
                                value={CanvasWidth}
                                onChange={(e) => setCanvasWidth(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height:</label>
                            <input
                                type="number"
                                value={CanvasHeight}
                                onChange={(e) => setCanvasHeight(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-6">
                            <button onClick={createEmptyCanvas} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main >
    );
}

export default ImageEditor;