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
    const createEmptyCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);

        }
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
    }, [file, imageSrc, rotate, flipHorizontal, flipVertical, zoom, brightnessValue, contrastValue, saturateValue, grayscaleValue, text, textcolor, textPositions, fontSize]);

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


                                                {/**
                                                
                                               
                                                
                                                 
                                              
                                               
                                                

                                                
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="941.157 641.992 203.993 233.988" width="203.993pt" height="233.988pt"><path d=" M 1145.15 781.054 C 1145.15 797.549 1140.58 813.779 1131.93 827.82 C 1092.33 892.033 993.974 892.033 954.379 827.819 C 945.676 813.704 941.157 797.637 941.157 781.054 C 941.157 737.044 941.157 693.035 941.157 649.025 C 941.157 645.14 944.307 641.992 948.191 641.992 C 1011.5 641.992 1074.81 641.992 1138.11 641.992 C 1142 641.992 1145.15 645.14 1145.15 649.025 C 1145.15 693.035 1145.15 737.045 1145.15 781.054 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="627.216 639.608 205.164 238.755" width="205.164pt" height="238.755pt"><path d=" M 741.947 874.295 C 734.756 879.719 724.84 879.719 717.648 874.295 L 635.242 812.137 C 630.188 808.325 627.216 802.361 627.216 796.03 L 627.216 646.642 C 627.216 642.757 630.365 639.608 634.25 639.608 L 825.346 639.608 C 829.231 639.608 832.38 642.757 832.38 646.642 L 832.38 796.03 C 832.38 802.361 829.408 808.325 824.354 812.137 L 741.947 874.295 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="939.984 316.01 206.336 260.174" width="206.336pt" height="260.174pt"><path d=" M 1146.32 526.205 C 1146.32 530.99 1144.29 535.55 1140.73 538.753 C 1085.35 588.66 1000.95 588.66 945.571 538.753 C 942.019 535.552 939.984 530.987 939.984 526.205 C 939.984 474.355 939.984 422.503 939.984 370.652 C 939.984 365.934 941.961 361.423 945.431 358.227 C 971.76 333.974 1007.46 315.38 1043.15 316.026 C 1078.85 315.38 1114.55 333.974 1140.88 358.227 C 1144.35 361.425 1146.32 365.932 1146.32 370.652 C 1146.32 422.503 1146.32 474.354 1146.32 526.205 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 321.583 249.027 249.028" width="249.027pt" height="249.028pt"><path d=" M 249.027 446.096 C 249.027 456.826 238.398 466.013 235.753 475.909 C 233.017 486.146 237.548 499.403 232.362 508.366 C 227.102 517.458 213.306 520.132 205.927 527.511 C 198.547 534.89 195.875 548.685 186.782 553.945 C 177.818 559.131 164.562 554.601 154.324 557.337 C 144.43 559.982 135.241 570.611 124.514 570.611 C 113.785 570.611 104.597 559.981 94.702 557.336 C 84.464 554.6 71.208 559.131 62.243 553.945 C 53.151 548.684 50.48 534.888 43.101 527.509 C 35.722 520.13 21.925 517.458 16.665 508.365 C 11.479 499.402 16.01 486.145 13.274 475.908 C 10.629 466.012 0 456.826 0 446.096 C 0 435.368 10.629 426.179 13.274 416.285 C 16.01 406.047 11.48 392.79 16.665 383.827 C 21.927 374.735 35.723 372.063 43.102 364.684 C 50.481 357.305 53.153 343.509 62.245 338.248 C 71.209 333.062 84.465 337.594 94.703 334.857 C 104.597 332.213 113.786 321.583 124.514 321.583 C 135.242 321.583 144.43 332.213 154.325 334.857 C 164.563 337.594 177.82 333.062 186.784 338.249 C 195.876 343.509 198.548 357.306 205.927 364.685 C 213.306 372.063 227.103 374.736 232.362 383.828 C 237.548 392.791 233.017 406.048 235.753 416.286 C 238.398 426.18 249.027 435.368 249.027 446.096 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="300.954 334.979 258.61 222.236" width="258.61pt" height="222.236pt"><path d=" M 430.259 557.215 C 545.598 491.998 555.144 426.95 557.695 417.685 C 565.904 387.874 547.731 334.979 489.864 334.979 C 434.763 334.979 430.259 362.602 430.259 362.602 C 430.259 362.602 425.754 334.979 370.653 334.979 C 312.786 334.979 294.613 387.874 302.822 417.685 C 305.373 426.95 314.919 491.998 430.259 557.215 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="928.152 0 229.998 260.574" width="229.998pt" height="260.574pt"><path d=" M 1043.15 260.574 C 1120.73 234.103 1135.99 185.903 1140.36 165.647 C 1146.74 135.989 1158.15 36.962 1158.15 36.962 C 1078.29 35.593 1043.15 0 1043.15 0 C 1043.15 0 1008.01 35.593 928.152 36.962 C 928.152 36.962 939.561 135.989 945.949 165.647 C 950.311 185.903 965.576 234.103 1043.15 260.574 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="29.027 627.129 220 253.712" width="220pt" height="253.712pt"><path d=" M 139.027 880.841 C 139.027 880.841 139.027 865.904 180.426 848.314 C 237.744 823.955 244.887 808.689 246.662 792.721 C 248.435 776.754 236.608 761.97 234.833 739.495 C 233.061 717.022 249.027 684.495 249.027 684.495 L 220.642 635.411 C 165.048 648.42 139.027 627.129 139.027 627.129 C 139.027 627.129 113.007 648.42 57.413 635.411 L 29.027 684.495 C 29.027 684.495 44.994 717.022 43.221 739.495 C 41.446 761.97 29.619 776.754 31.393 792.721 C 33.166 808.689 40.311 823.955 97.629 848.314 C 139.027 865.904 139.027 880.841 139.027 880.841 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="305.954 2.451 220 255.673" width="220pt" height="255.673pt"><path d=" M 415.013 258.124 C 434.751 230.865 481.753 215.825 493.029 214.885 C 498.67 210.186 526.87 197.966 525.931 169.766 C 524.99 141.566 524.051 28.77 524.051 28.77 C 518.412 26.891 468.592 2.451 468.592 2.451 C 456.372 10.912 415.013 9.972 415.013 9.972 L 416.894 9.972 C 416.894 9.972 375.535 10.912 363.315 2.451 C 363.315 2.451 313.496 26.891 307.857 28.77 C 307.857 28.77 306.917 141.566 305.977 169.766 C 305.038 197.966 333.237 210.186 338.878 214.885 C 350.157 215.825 397.156 230.865 416.894 258.124 L 415.013 258.124 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="75.02 150.749 59.587 53.184" width="59.587pt" height="53.184pt"><path d=" M 116.76 150.749 L 92.867 150.749 C 90.759 150.749 88.811 151.873 87.757 153.699 L 75.811 174.39 C 74.757 176.216 74.757 178.465 75.811 180.292 L 87.757 200.983 C 88.811 202.808 90.759 203.933 92.867 203.933 L 116.76 203.933 C 118.868 203.933 120.816 202.808 121.87 200.983 L 133.817 180.292 C 134.87 178.465 134.87 176.216 133.817 174.39 L 121.87 153.699 C 120.816 151.873 118.868 150.749 116.76 150.749 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="83.617 228.021 50.92 45.107" width="50.92pt" height="45.107pt"><path d=" M 105.781 229.924 L 84.132 267.419 C 82.667 269.958 84.499 273.128 87.429 273.128 L 130.724 273.128 C 133.655 273.128 135.486 269.958 134.021 267.419 L 112.373 229.924 C 110.908 227.387 107.245 227.387 105.781 229.924 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="83.616 291.396 54.918 52.378" width="54.918pt" height="52.378pt"><path d=" M 112.492 292.426 L 117.953 309.231 C 118.152 309.845 118.725 310.261 119.371 310.261 L 137.04 310.261 C 138.484 310.261 139.085 312.11 137.916 312.959 L 123.621 323.344 C 123.099 323.724 122.88 324.397 123.08 325.011 L 128.54 341.816 C 128.986 343.189 127.414 344.332 126.246 343.483 L 111.951 333.097 C 111.428 332.717 110.721 332.717 110.199 333.097 L 95.904 343.483 C 94.735 344.332 93.163 343.189 93.609 341.816 L 99.07 325.011 C 99.269 324.397 99.051 323.724 98.528 323.344 L 84.233 312.959 C 83.065 312.11 83.665 310.261 85.109 310.261 L 102.779 310.261 C 103.425 310.261 103.997 309.845 104.197 309.231 L 109.657 292.426 C 110.103 291.053 112.046 291.053 112.492 292.426 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2089.97 2671.9 859.56 751.55" width="859.56pt" height="751.55pt"><path d=" M 2923.99 2893.58 L 2923.99 3352.5 C 2923.99 3377.58 2903.66 3397.91 2878.58 3397.91 L 2160.92 3397.91 C 2135.84 3397.91 2115.51 3377.58 2115.51 3352.5 L 2115.51 2893.58 C 2115.51 2868.5 2135.84 2848.17 2160.92 2848.17 L 2271.6 2848.17 C 2318.19 2758.61 2411.82 2697.44 2519.75 2697.44 C 2627.68 2697.44 2721.31 2758.61 2767.9 2848.17 L 2878.58 2848.17 C 2903.66 2848.17 2923.99 2868.5 2923.99 2893.58 Z  M 2932.5 3352.5 C 2932.5 3382.24 2908.31 3406.43 2878.58 3406.43 L 2160.92 3406.43 C 2131.19 3406.43 2107 3382.24 2107 3352.5 L 2107 2893.58 C 2107 2863.85 2131.19 2839.66 2160.92 2839.66 L 2266.48 2839.66 C 2317.03 2746.54 2413.59 2688.93 2519.75 2688.93 C 2625.91 2688.93 2722.47 2746.54 2773.02 2839.66 L 2878.58 2839.66 C 2908.31 2839.66 2932.5 2863.85 2932.5 2893.58 L 2932.5 3352.5 Z  M 2878.58 2822.63 L 2782.96 2822.63 C 2728.25 2729.4 2628.33 2671.9 2519.75 2671.9 C 2411.17 2671.9 2311.25 2729.4 2256.54 2822.63 L 2160.92 2822.63 C 2121.8 2822.63 2089.97 2854.46 2089.97 2893.58 L 2089.97 3352.5 C 2089.97 3391.63 2121.8 3423.45 2160.92 3423.45 L 2878.58 3423.45 C 2917.7 3423.45 2949.53 3391.63 2949.53 3352.5 L 2949.53 2893.58 C 2949.53 2854.46 2917.7 2822.63 2878.58 2822.63 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="3607.116 1550.73 741.193 803.32" width="741.193pt" height="803.32pt"><path d=" M 4158.58 1594.99 C 4228.32 1611.26 4274.32 1633.47 4298.46 1647.41 C 4311.55 1654.96 4320.05 1668.47 4321.14 1683.55 C 4325.91 1749.64 4326.86 1947.66 4194.99 2140.01 C 4127.75 2238.09 4041.22 2299.69 3999.79 2322.69 C 3986.05 2330.31 3969.38 2330.31 3955.64 2322.69 C 3914.21 2299.69 3827.68 2238.09 3760.44 2140.01 C 3628.57 1947.66 3629.52 1749.64 3634.29 1683.55 C 3635.38 1668.47 3643.87 1654.96 3656.96 1647.41 C 3681.11 1633.47 3727.11 1611.26 3796.85 1594.99 C 3903.23 1570.17 4052.2 1570.17 4158.58 1594.99 Z  M 4202.04 2144.84 C 4122.66 2260.64 4023.09 2319.53 4003.94 2330.16 C 3995.93 2334.61 3986.86 2336.96 3977.72 2336.96 C 3968.57 2336.96 3959.5 2334.61 3951.49 2330.16 C 3932.34 2319.53 3832.77 2260.64 3753.39 2144.84 C 3621.94 1953.11 3620.35 1757.94 3625.76 1682.93 C 3627.06 1665.04 3637.12 1648.99 3652.69 1640 C 3679.44 1624.57 3725.82 1602.79 3794.91 1586.67 C 3846.98 1574.52 3911.9 1567.82 3977.71 1567.82 C 4043.53 1567.82 4108.45 1574.52 4160.52 1586.67 C 4229.61 1602.79 4275.99 1624.57 4302.74 1640 C 4318.3 1648.99 4328.37 1665.03 4329.66 1682.93 C 4335.08 1757.94 4333.49 1953.11 4202.04 2144.84 Z  M 4346.71 1681.7 C 4345.01 1658.14 4331.76 1637.02 4311.28 1625.2 C 4283.54 1609.18 4235.53 1586.61 4164.4 1570.02 C 4111.1 1557.58 4044.8 1550.73 3977.71 1550.73 C 3910.63 1550.73 3844.32 1557.58 3791.02 1570.02 C 3719.89 1586.61 3671.89 1609.18 3644.15 1625.2 C 3623.66 1637.02 3610.41 1658.14 3608.71 1681.7 C 3603.17 1758.51 3604.79 1958.33 3739.28 2154.51 C 3820.84 2273.46 3923.45 2334.15 3943.2 2345.11 C 3953.74 2350.96 3965.68 2354.05 3977.72 2354.05 C 3989.76 2354.05 4001.69 2350.96 4012.23 2345.11 C 4031.97 2334.15 4134.59 2273.46 4216.14 2154.51 C 4350.64 1958.33 4352.26 1758.51 4346.71 1681.7 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="1981.99 1546.35 1086.15 812.08" width="1086.15pt" height="812.08pt"><path d=" M 3012.97 2155.13 L 2540.84 2330.06 C 2530.66 2333.83 2519.47 2333.83 2509.29 2330.06 L 2037.16 2155.13 C 2019.35 2148.53 2007.53 2131.54 2007.53 2112.55 L 2007.53 1792.23 C 2007.53 1773.24 2019.35 1756.25 2037.16 1749.65 L 2509.29 1574.72 C 2519.47 1570.95 2530.66 1570.95 2540.84 1574.72 L 3012.97 1749.65 C 3030.78 1756.25 3042.6 1773.24 3042.6 1792.23 L 3042.6 2112.55 C 3042.6 2131.54 3030.78 2148.53 3012.97 2155.13 Z  M 3051.12 2112.55 C 3051.12 2134.99 3036.97 2155.31 3015.93 2163.11 L 2543.8 2338.05 C 2537.78 2340.27 2531.48 2341.4 2525.07 2341.4 C 2518.65 2341.4 2512.35 2340.27 2506.33 2338.05 L 2034.2 2163.11 C 2013.16 2155.31 1999.02 2134.99 1999.02 2112.55 L 1999.02 1792.23 C 1999.02 1769.79 2013.16 1749.47 2034.2 1741.67 L 2506.33 1566.74 C 2512.35 1564.51 2518.65 1563.38 2525.07 1563.38 C 2531.48 1563.38 2537.78 1564.51 2543.8 1566.74 L 3015.93 1741.67 C 3036.97 1749.47 3051.12 1769.79 3051.12 1792.23 L 3051.12 2112.55 Z  M 3021.84 1725.7 L 2549.72 1550.77 C 2541.8 1547.84 2533.51 1546.35 2525.07 1546.35 C 2516.62 1546.35 2508.33 1547.84 2500.42 1550.77 L 2028.29 1725.7 C 2000.59 1735.96 1981.99 1762.7 1981.99 1792.23 L 1981.99 2112.55 C 1981.99 2142.08 2000.59 2168.82 2028.29 2179.08 L 2500.42 2354.01 C 2508.33 2356.94 2516.62 2358.43 2525.07 2358.43 C 2533.51 2358.43 2541.8 2356.94 2549.72 2354.01 L 3021.84 2179.08 C 3049.54 2168.82 3068.14 2142.08 3068.14 2112.55 L 3068.14 1792.23 C 3068.14 1762.7 3049.54 1735.96 3021.84 1725.7 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="658.854 1575.67 812.196 812.23" width="812.196pt" height="812.23pt"><path d=" M 1032.83 2349.06 L 697.67 2013.89 C 679.938 1996.16 679.938 1967.41 697.67 1949.68 L 1032.83 1614.52 C 1050.56 1596.78 1079.32 1596.78 1097.05 1614.52 L 1432.21 1949.68 C 1449.94 1967.41 1449.94 1996.16 1432.21 2013.89 L 1097.05 2349.06 C 1079.32 2366.79 1050.56 2366.79 1032.83 2349.06 Z  M 1438.23 2019.91 L 1103.07 2355.08 C 1092.88 2365.26 1079.34 2370.87 1064.94 2370.87 C 1050.54 2370.87 1037 2365.26 1026.81 2355.08 L 691.65 2019.91 C 670.626 1998.89 670.626 1964.68 691.65 1943.66 L 1026.81 1608.5 C 1037 1598.31 1050.54 1592.7 1064.94 1592.7 C 1079.34 1592.7 1092.88 1598.31 1103.07 1608.5 L 1438.23 1943.66 C 1448.41 1953.84 1454.02 1967.38 1454.02 1981.79 C 1454.02 1996.19 1448.41 2009.73 1438.23 2019.91 Z  M 1450.27 1931.62 L 1115.11 1596.46 C 1101.71 1583.05 1083.89 1575.67 1064.94 1575.67 C 1045.99 1575.67 1028.17 1583.05 1014.77 1596.46 L 679.61 1931.62 C 666.225 1945 658.854 1962.82 658.854 1981.79 C 658.854 2000.75 666.225 2018.57 679.61 2031.95 L 1014.77 2367.11 C 1028.17 2380.51 1045.99 2387.9 1064.94 2387.9 C 1083.89 2387.9 1101.71 2380.51 1115.11 2367.11 L 1450.27 2031.95 C 1463.67 2018.55 1471.05 2000.74 1471.05 1981.79 C 1471.05 1962.83 1463.67 1945.02 1450.27 1931.62 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="3578.84 479.893 797.75 803.327" width="797.75pt" height="803.327pt"><path d=" M 4305.03 505.652 C 4330.33 505.652 4350.83 526.155 4350.83 551.447 L 4350.83 728.33 C 4350.83 938.268 4218.73 1134.15 3999.1 1252.09 C 3985.77 1259.25 3969.66 1259.25 3956.33 1252.09 C 3736.7 1134.15 3604.6 938.268 3604.6 728.33 L 3604.6 551.447 C 3604.6 526.155 3625.1 505.652 3650.4 505.652 L 4305.03 505.652 Z  M 4359.41 728.329 C 4359.41 941.241 4226.24 1139.87 4003.16 1259.65 C 3995.38 1263.83 3986.58 1266.04 3977.72 1266.04 C 3968.85 1266.04 3960.05 1263.83 3952.27 1259.65 C 3729.19 1139.86 3596.01 941.24 3596.01 728.329 L 3596.01 551.447 C 3596.01 521.461 3620.41 497.066 3650.4 497.066 L 4305.03 497.066 C 4335.02 497.066 4359.41 521.461 4359.41 551.447 L 4359.41 728.329 Z  M 4305.03 479.893 L 3650.4 479.893 C 3610.94 479.893 3578.84 511.992 3578.84 551.447 L 3578.84 728.329 C 3578.84 947.671 3715.4 1151.95 3944.14 1274.78 C 3954.42 1280.3 3966.03 1283.22 3977.72 1283.22 C 3989.4 1283.22 4001.02 1280.3 4011.29 1274.78 C 4240.03 1151.95 4376.59 947.673 4376.59 728.329 L 4376.59 551.447 C 4376.59 511.992 4344.49 479.893 4305.03 479.893 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2163.8 454.352 722.53 812.348" width="722.53pt" height="812.348pt"><path d=" M 2838.08 1067.46 L 2547.77 1235.07 C 2533.72 1243.19 2516.41 1243.19 2502.36 1235.07 L 2212.05 1067.46 C 2198 1059.35 2189.35 1044.36 2189.35 1028.14 L 2189.35 692.913 C 2189.35 676.69 2198 661.7 2212.05 653.589 L 2502.36 485.977 C 2516.41 477.865 2533.72 477.865 2547.77 485.977 L 2838.08 653.589 C 2852.13 661.7 2860.79 676.69 2860.79 692.913 L 2860.79 1028.14 C 2860.79 1044.36 2852.13 1059.35 2838.08 1067.46 Z  M 2869.3 1028.14 C 2869.3 1047.34 2858.97 1065.23 2842.34 1074.84 L 2552.03 1242.45 C 2543.84 1247.17 2534.52 1249.67 2525.07 1249.67 C 2515.61 1249.67 2506.29 1247.17 2498.1 1242.45 L 2207.79 1074.84 C 2191.16 1065.23 2180.83 1047.34 2180.83 1028.14 L 2180.83 692.914 C 2180.83 673.71 2191.16 655.817 2207.79 646.216 L 2498.1 478.604 C 2506.29 473.877 2515.61 471.38 2525.07 471.38 C 2534.52 471.38 2543.84 473.877 2552.03 478.604 L 2842.34 646.216 C 2858.97 655.816 2869.3 673.71 2869.3 692.914 L 2869.3 1028.14 Z  M 2850.85 631.469 L 2560.54 463.858 C 2549.77 457.639 2537.5 454.352 2525.07 454.352 C 2512.63 454.352 2500.36 457.639 2489.59 463.857 L 2199.28 631.469 C 2177.4 644.103 2163.8 667.647 2163.8 692.914 L 2163.8 1028.14 C 2163.8 1053.4 2177.4 1076.95 2199.28 1089.58 L 2489.59 1257.2 C 2500.37 1263.42 2512.63 1266.7 2525.07 1266.7 C 2537.5 1266.7 2549.76 1263.41 2560.54 1257.19 L 2850.85 1089.58 C 2872.73 1076.95 2886.33 1053.4 2886.33 1028.14 L 2886.33 692.914 C 2886.33 667.645 2872.73 644.101 2850.85 631.469 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="623.413 512.608 883.081 695.832" width="883.081pt" height="695.832pt"><path d=" M 1027.21 1162.73 L 656.787 608.799 C 636.611 578.627 658.237 538.15 694.533 538.15 L 1435.37 538.15 C 1471.67 538.15 1493.29 578.627 1473.12 608.799 L 1102.7 1162.73 C 1084.72 1189.62 1045.19 1189.62 1027.21 1162.73 Z  M 1480.19 613.53 L 1109.77 1167.47 C 1099.75 1182.46 1082.99 1191.42 1064.95 1191.42 C 1046.91 1191.42 1030.16 1182.46 1020.13 1167.47 L 649.71 613.53 C 638.458 596.705 637.436 576.002 646.974 558.148 C 656.512 540.295 674.292 529.636 694.533 529.636 L 1435.37 529.636 C 1455.61 529.636 1473.39 540.295 1482.93 558.148 C 1492.47 576 1491.45 596.705 1480.19 613.53 Z  M 1497.95 550.125 C 1485.4 526.633 1462.01 512.608 1435.37 512.608 L 694.533 512.608 C 667.899 512.608 644.505 526.633 631.955 550.125 C 619.404 573.616 620.751 600.858 635.555 622.996 L 1005.97 1176.93 C 1019.17 1196.66 1041.22 1208.44 1064.95 1208.44 C 1088.69 1208.44 1110.74 1196.66 1123.93 1176.93 L 1494.35 622.996 C 1509.16 600.856 1510.5 573.614 1497.95 550.125 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="3672.96 3730.79 609.51 810.66" width="609.51pt" height="810.66pt"><path d=" M 4211.52 3756.33 C 4236.6 3756.33 4256.93 3776.66 4256.93 3801.74 L 4256.93 4236.69 C 4256.93 4390.89 4131.92 4515.9 3977.71 4515.9 L 3977.71 4515.9 C 3823.51 4515.9 3698.5 4390.89 3698.5 4236.69 L 3698.5 3801.74 C 3698.5 3776.66 3718.83 3756.33 3743.91 3756.33 L 4211.52 3756.33 Z  M 4265.44 4236.69 C 4265.44 4395.34 4136.37 4524.42 3977.71 4524.42 C 3819.06 4524.42 3689.99 4395.34 3689.99 4236.69 L 3689.99 3801.74 C 3689.99 3772.01 3714.17 3747.82 3743.91 3747.82 L 4211.52 3747.82 C 4241.25 3747.82 4265.44 3772.01 4265.44 3801.74 L 4265.44 4236.69 Z  M 4211.52 3730.79 L 3743.91 3730.79 C 3704.79 3730.79 3672.96 3762.62 3672.96 3801.74 L 3672.96 4236.69 C 3672.96 4404.73 3809.67 4541.45 3977.71 4541.45 C 4145.76 4541.45 4282.47 4404.73 4282.47 4236.69 L 4282.47 3801.74 C 4282.47 3762.62 4250.64 3730.79 4211.52 3730.79 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="354.535 287.679 761.38 760.095" width="761.38pt" height="760.095pt"><path d=" M 1115.915 354.746 C 1115.915 342.399 1105.907 332.39 1093.56 332.39 C 1105.907 332.39 1115.915 322.381 1115.915 310.034 C 1115.915 297.688 1105.907 287.679 1093.56 287.679 C 1093.343 287.679 1093.132 287.705 1092.917 287.711 C 1092.702 287.705 1092.491 287.679 1092.274 287.679 C 1080.863 287.679 1071.469 296.233 1070.106 307.274 L 1069.73 307.274 C 1068.367 296.233 1058.972 287.679 1047.562 287.679 C 1036.153 287.679 1026.757 296.233 1025.394 307.274 L 1025.019 307.274 C 1023.656 296.233 1014.261 287.679 1002.851 287.679 C 991.441 287.679 982.046 296.233 980.683 307.274 L 980.307 307.274 C 978.945 296.233 969.549 287.679 958.139 287.679 C 946.73 287.679 937.334 296.233 935.971 307.274 L 935.596 307.274 C 934.233 296.233 924.838 287.679 913.428 287.679 C 902.017 287.679 892.623 296.233 891.261 307.274 L 890.884 307.274 C 889.522 296.233 880.127 287.679 868.716 287.679 C 857.306 287.679 847.911 296.233 846.548 307.274 L 846.173 307.274 C 844.81 296.233 835.415 287.679 824.005 287.679 C 812.595 287.679 803.2 296.233 801.837 307.274 L 801.461 307.274 C 800.099 296.233 790.704 287.679 779.293 287.679 C 767.883 287.679 758.488 296.233 757.125 307.274 L 756.75 307.274 C 755.387 296.233 745.992 287.679 734.582 287.679 C 723.172 287.679 713.777 296.233 712.414 307.274 L 712.038 307.274 C 710.676 296.233 701.281 287.679 689.87 287.679 C 678.461 287.679 669.065 296.233 667.702 307.274 L 667.327 307.274 C 665.964 296.233 656.569 287.679 645.159 287.679 C 633.749 287.679 624.354 296.233 622.991 307.274 L 622.616 307.274 C 621.253 296.233 611.858 287.679 600.448 287.679 C 589.038 287.679 579.643 296.233 578.28 307.274 L 577.904 307.274 C 576.541 296.233 567.146 287.679 555.736 287.679 C 544.326 287.679 534.931 296.233 533.569 307.274 L 533.193 307.274 C 531.83 296.233 522.435 287.679 511.025 287.679 C 499.615 287.679 490.22 296.233 488.857 307.274 L 488.482 307.274 C 487.119 296.233 477.723 287.679 466.314 287.679 C 454.903 287.679 445.509 296.233 444.146 307.274 L 443.77 307.274 C 442.407 296.233 433.012 287.679 421.602 287.679 C 410.192 287.679 400.797 296.233 399.434 307.274 L 399.059 307.274 C 397.696 296.233 388.301 287.679 376.891 287.679 C 364.544 287.679 354.535 297.688 354.535 310.034 C 354.535 321.947 363.86 331.655 375.604 332.325 L 375.604 332.455 C 363.86 333.125 354.535 342.833 354.535 354.746 C 354.535 366.659 363.86 376.367 375.604 377.037 L 375.604 377.167 C 363.86 377.837 354.535 387.545 354.535 399.457 C 354.535 411.37 363.86 421.078 375.604 421.748 L 375.604 421.878 C 363.86 422.548 354.535 432.257 354.535 444.169 C 354.535 456.081 363.86 465.79 375.604 466.46 L 375.604 466.589 C 363.86 467.26 354.535 476.968 354.535 488.88 C 354.535 500.793 363.86 510.501 375.604 511.171 L 375.604 511.301 C 363.86 511.971 354.535 521.68 354.535 533.592 C 354.535 545.504 363.86 555.213 375.604 555.883 L 375.604 556.012 C 363.86 556.682 354.535 566.391 354.535 578.303 C 354.535 590.215 363.86 599.924 375.604 600.594 L 375.604 600.724 C 363.86 601.394 354.535 611.103 354.535 623.015 C 354.535 634.927 363.86 644.636 375.604 645.305 L 375.604 645.435 C 363.86 646.105 354.535 655.814 354.535 667.726 C 354.535 679.638 363.86 689.347 375.604 690.017 L 375.604 690.147 C 363.86 690.816 354.535 700.525 354.535 712.437 C 354.535 724.35 363.86 734.059 375.604 734.729 L 375.604 734.859 C 363.86 735.529 354.535 745.237 354.535 757.149 C 354.535 769.062 363.86 778.77 375.604 779.44 L 375.604 779.57 C 363.86 780.239 354.535 789.948 354.535 801.861 C 354.535 813.773 363.86 823.481 375.604 824.151 L 375.604 824.281 C 363.86 824.952 354.535 834.659 354.535 846.571 C 354.535 858.485 363.86 868.192 375.604 868.863 L 375.604 868.993 C 363.86 869.662 354.535 879.371 354.535 891.284 C 354.535 903.196 363.86 912.905 375.604 913.574 L 375.604 913.704 C 363.86 914.374 354.535 924.082 354.535 935.994 C 354.535 947.907 363.86 957.615 375.604 958.285 L 375.604 958.415 C 363.86 959.086 354.535 968.793 354.535 980.707 C 354.535 992.619 363.86 1002.328 375.604 1002.997 L 375.604 1003.127 C 363.86 1003.797 354.535 1013.505 354.535 1025.417 C 354.535 1037.764 364.544 1047.774 376.891 1047.774 C 389.237 1047.774 399.246 1037.764 399.246 1025.417 L 399.237 1025.229 L 399.256 1025.229 L 399.246 1025.417 C 399.246 1037.764 409.255 1047.774 421.602 1047.774 C 433.949 1047.774 443.957 1037.764 443.957 1025.417 L 443.948 1025.229 L 443.967 1025.229 L 443.957 1025.417 C 443.957 1037.764 453.967 1047.774 466.314 1047.774 C 478.66 1047.774 488.67 1037.764 488.67 1025.417 L 488.66 1025.229 L 488.679 1025.229 L 488.67 1025.417 C 488.67 1037.764 498.678 1047.774 511.025 1047.774 C 523.371 1047.774 533.38 1037.764 533.38 1025.417 L 533.371 1025.229 L 533.39 1025.229 L 533.38 1025.417 C 533.38 1037.764 543.39 1047.774 555.736 1047.774 C 568.083 1047.774 578.092 1037.764 578.092 1025.417 L 578.083 1025.229 L 578.102 1025.229 L 578.092 1025.417 C 578.092 1037.764 588.101 1047.774 600.448 1047.774 C 612.794 1047.774 622.803 1037.764 622.803 1025.417 L 622.794 1025.229 L 622.813 1025.229 L 622.803 1025.417 C 622.803 1037.764 632.813 1047.774 645.159 1047.774 C 657.506 1047.774 667.515 1037.764 667.515 1025.417 L 667.506 1025.229 L 667.525 1025.229 L 667.515 1025.417 C 667.515 1037.764 677.524 1047.774 689.87 1047.774 C 702.217 1047.774 712.227 1037.764 712.227 1025.417 L 712.217 1025.229 L 712.236 1025.229 L 712.227 1025.417 C 712.227 1037.764 722.236 1047.774 734.582 1047.774 C 746.929 1047.774 756.938 1037.764 756.938 1025.417 L 756.928 1025.229 L 756.947 1025.229 L 756.938 1025.417 C 756.938 1037.764 766.947 1047.774 779.293 1047.774 C 791.64 1047.774 801.649 1037.764 801.649 1025.417 L 801.64 1025.229 L 801.659 1025.229 L 801.649 1025.417 C 801.649 1037.764 811.658 1047.774 824.005 1047.774 C 836.352 1047.774 846.361 1037.764 846.361 1025.417 L 846.351 1025.229 L 846.37 1025.229 L 846.361 1025.417 C 846.361 1037.764 856.369 1047.774 868.716 1047.774 C 881.063 1047.774 891.072 1037.764 891.072 1025.417 L 891.062 1025.229 L 891.081 1025.229 L 891.072 1025.417 C 891.072 1037.764 901.081 1047.774 913.428 1047.774 C 925.775 1047.774 935.784 1037.764 935.784 1025.417 L 935.774 1025.229 L 935.793 1025.229 L 935.784 1025.417 C 935.784 1037.764 945.792 1047.774 958.139 1047.774 C 970.486 1047.774 980.495 1037.764 980.495 1025.417 L 980.485 1025.229 L 980.504 1025.229 L 980.495 1025.417 C 980.495 1037.764 990.504 1047.774 1002.851 1047.774 C 1015.198 1047.774 1025.207 1037.764 1025.207 1025.417 L 1025.197 1025.229 L 1025.216 1025.229 L 1025.207 1025.417 C 1025.207 1037.764 1035.215 1047.774 1047.562 1047.774 C 1059.908 1047.774 1069.918 1037.764 1069.918 1025.417 L 1069.908 1025.229 L 1069.927 1025.229 L 1069.918 1025.417 C 1069.918 1037.764 1079.927 1047.774 1092.274 1047.774 C 1092.491 1047.774 1092.702 1047.748 1092.917 1047.741 C 1093.132 1047.748 1093.343 1047.774 1093.56 1047.774 C 1105.907 1047.774 1115.915 1037.764 1115.915 1025.417 C 1115.915 1013.07 1105.907 1003.061 1093.56 1003.061 C 1105.907 1003.061 1115.915 993.053 1115.915 980.707 C 1115.915 968.36 1105.907 958.351 1093.56 958.351 C 1105.907 958.351 1115.915 948.341 1115.915 935.994 C 1115.915 923.648 1105.907 913.639 1093.56 913.639 C 1105.907 913.639 1115.915 903.63 1115.915 891.284 C 1115.915 878.937 1105.907 868.928 1093.56 868.928 C 1105.907 868.928 1115.915 858.918 1115.915 846.571 C 1115.915 834.225 1105.907 824.216 1093.56 824.216 C 1105.907 824.216 1115.915 814.208 1115.915 801.861 C 1115.915 789.514 1105.907 779.505 1093.56 779.505 C 1105.907 779.505 1115.915 769.495 1115.915 757.149 C 1115.915 744.802 1105.907 734.793 1093.56 734.793 C 1105.907 734.793 1115.915 724.784 1115.915 712.437 C 1115.915 700.091 1105.907 690.082 1093.56 690.082 C 1105.907 690.082 1115.915 680.073 1115.915 667.726 C 1115.915 655.379 1105.907 645.37 1093.56 645.37 C 1105.907 645.37 1115.915 635.362 1115.915 623.015 C 1115.915 610.668 1105.907 600.659 1093.56 600.659 C 1105.907 600.659 1115.915 590.65 1115.915 578.303 C 1115.915 565.956 1105.907 555.947 1093.56 555.947 C 1105.907 555.947 1115.915 545.938 1115.915 533.592 C 1115.915 521.245 1105.907 511.236 1093.56 511.236 C 1105.907 511.236 1115.915 501.227 1115.915 488.88 C 1115.915 476.533 1105.907 466.524 1093.56 466.524 C 1105.907 466.524 1115.915 456.516 1115.915 444.169 C 1115.915 431.822 1105.907 421.813 1093.56 421.813 C 1105.907 421.813 1115.915 411.804 1115.915 399.457 C 1115.915 387.11 1105.907 377.102 1093.56 377.102 C 1105.907 377.102 1115.915 367.093 1115.915 354.746 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="1854.64 74.774 335.54 335.528" width="335.54pt" height="335.528pt"><path d=" M 2178.07 254.976 C 2177.91 254.951 2177.76 254.945 2177.6 254.926 C 2177.61 254.816 2177.62 254.706 2177.63 254.596 C 2177.79 254.602 2177.94 254.62 2178.09 254.62 C 2184.77 254.62 2190.18 249.209 2190.18 242.537 C 2190.18 236.223 2185.33 231.044 2179.17 230.497 C 2185.19 229.027 2189.19 223.175 2188.23 216.933 C 2187.22 210.336 2181.06 205.807 2174.46 206.828 C 2174.3 206.852 2174.15 206.893 2173.99 206.923 C 2173.97 206.817 2173.94 206.712 2173.92 206.607 C 2174.07 206.565 2174.22 206.529 2174.37 206.48 C 2180.73 204.441 2184.23 197.634 2182.19 191.289 L 2182.19 191.277 C 2180.16 184.931 2173.35 181.423 2167 183.461 C 2166.85 183.511 2166.7 183.576 2166.55 183.631 C 2166.51 183.529 2166.47 183.427 2166.42 183.325 C 2166.57 183.259 2166.72 183.208 2166.86 183.135 C 2172.82 180.12 2175.2 172.849 2172.19 166.893 C 2169.19 160.946 2161.91 158.561 2155.96 161.566 C 2155.81 161.638 2155.69 161.724 2155.55 161.801 C 2155.49 161.71 2155.43 161.621 2155.38 161.531 C 2155.51 161.444 2155.64 161.364 2155.77 161.272 C 2161.18 157.364 2162.4 149.809 2158.49 144.41 C 2154.58 138.988 2147.04 137.779 2141.63 141.689 C 2141.5 141.782 2141.38 141.888 2141.25 141.987 L 2141.04 141.734 C 2141.16 141.626 2141.28 141.528 2141.4 141.415 C 2146.12 136.708 2146.15 129.059 2141.45 124.322 C 2136.75 119.594 2129.1 119.562 2124.36 124.269 C 2124.25 124.38 2124.16 124.5 2124.05 124.614 L 2123.79 124.393 C 2123.89 124.268 2124 124.156 2124.09 124.027 C 2128.04 118.648 2126.88 111.083 2121.49 107.143 C 2116.11 103.203 2108.55 104.36 2104.6 109.749 C 2104.51 109.878 2104.43 110.013 2104.34 110.145 C 2104.24 110.084 2104.15 110.022 2104.05 109.961 C 2104.13 109.82 2104.22 109.694 2104.3 109.549 C 2107.34 103.624 2105.01 96.332 2099.08 93.286 L 2099.08 93.276 C 2093.15 90.228 2085.86 92.56 2082.81 98.497 C 2082.74 98.639 2082.68 98.785 2082.62 98.928 C 2082.51 98.884 2082.4 98.842 2082.3 98.798 C 2082.35 98.649 2082.42 98.504 2082.47 98.35 C 2084.55 92.004 2081.09 85.176 2074.75 83.105 C 2068.42 81.025 2061.59 84.471 2059.51 90.816 C 2059.46 90.971 2059.43 91.127 2059.38 91.282 C 2059.28 91.257 2059.17 91.23 2059.06 91.205 C 2059.1 91.047 2059.14 90.894 2059.16 90.733 C 2060.21 84.145 2055.73 77.946 2049.14 76.896 C 2042.55 75.835 2036.35 80.321 2035.29 86.909 C 2035.27 87.067 2035.26 87.224 2035.24 87.382 C 2035.14 87.373 2035.03 87.363 2034.92 87.354 C 2034.93 87.198 2034.95 87.045 2034.95 86.888 C 2034.97 80.216 2029.57 74.784 2022.9 74.774 C 2016.22 74.753 2010.8 80.143 2010.78 86.814 C 2010.78 86.972 2010.8 87.125 2010.8 87.283 C 2010.69 87.29 2010.58 87.295 2010.47 87.303 C 2010.46 87.147 2010.45 86.991 2010.43 86.834 C 2009.41 80.237 2003.24 75.719 1996.64 76.738 C 1990.05 77.757 1985.52 83.924 1986.54 90.523 C 1986.57 90.68 1986.61 90.832 1986.64 90.987 C 1986.53 91.013 1986.43 91.04 1986.32 91.065 C 1986.28 90.913 1986.25 90.759 1986.2 90.607 C 1984.16 84.25 1977.35 80.752 1970.99 82.8 C 1964.64 84.839 1961.15 91.647 1963.19 98.003 C 1963.24 98.158 1963.3 98.304 1963.35 98.455 C 1963.26 98.495 1963.16 98.535 1963.06 98.576 C 1962.99 98.431 1962.94 98.283 1962.86 98.14 C 1959.85 92.183 1952.58 89.808 1946.62 92.823 C 1940.66 95.849 1938.29 103.119 1941.3 109.066 C 1941.38 109.209 1941.47 109.333 1941.55 109.473 C 1941.45 109.53 1941.36 109.591 1941.27 109.648 C 1941.18 109.519 1941.1 109.384 1941.01 109.255 C 1937.1 103.845 1929.55 102.636 1924.15 106.545 L 1924.14 106.545 C 1918.74 110.453 1917.53 118.018 1921.44 123.418 C 1921.53 123.548 1921.64 123.661 1921.74 123.787 L 1921.48 124.004 C 1921.38 123.887 1921.28 123.763 1921.16 123.648 C 1916.46 118.92 1908.81 118.9 1904.08 123.606 C 1899.35 128.314 1899.33 135.962 1904.04 140.69 C 1904.15 140.803 1904.27 140.9 1904.39 141.007 L 1904.17 141.265 C 1904.04 141.166 1903.93 141.058 1903.8 140.963 C 1898.42 137.024 1890.85 138.2 1886.91 143.59 C 1882.97 148.969 1884.15 156.534 1889.54 160.462 C 1889.67 160.557 1889.8 160.64 1889.94 160.729 C 1889.88 160.825 1889.81 160.921 1889.75 161.018 C 1889.62 160.939 1889.48 160.852 1889.34 160.778 C 1883.4 157.731 1876.12 160.074 1873.08 166.01 C 1870.03 171.946 1872.37 179.227 1878.31 182.274 C 1878.45 182.348 1878.6 182.398 1878.74 182.465 C 1878.7 182.573 1878.65 182.683 1878.61 182.792 C 1878.46 182.736 1878.31 182.671 1878.16 182.621 C 1871.82 180.54 1865 184.007 1862.92 190.343 C 1860.85 196.688 1864.3 203.507 1870.65 205.587 C 1870.8 205.638 1870.96 205.675 1871.11 205.719 C 1871.09 205.823 1871.06 205.928 1871.04 206.033 C 1870.88 206.002 1870.73 205.96 1870.57 205.933 C 1863.98 204.883 1857.78 209.37 1856.73 215.967 C 1855.69 222.555 1860.17 228.742 1866.76 229.793 C 1866.92 229.819 1867.08 229.833 1867.24 229.852 C 1867.23 229.959 1867.22 230.066 1867.21 230.174 C 1867.06 230.169 1866.91 230.151 1866.75 230.15 C 1860.07 230.14 1854.65 235.529 1854.64 242.212 C 1854.63 248.883 1860.03 254.294 1866.7 254.315 L 1866.72 254.315 C 1866.87 254.315 1867.01 254.298 1867.16 254.292 C 1867.17 254.402 1867.18 254.513 1867.19 254.623 C 1867.03 254.642 1866.88 254.647 1866.72 254.672 C 1860.12 255.692 1855.6 261.869 1856.63 268.467 C 1857.56 274.424 1862.71 278.689 1868.56 278.689 C 1869.18 278.689 1869.8 278.647 1870.42 278.553 C 1870.58 278.528 1870.73 278.486 1870.89 278.455 C 1870.92 278.561 1870.95 278.667 1870.97 278.773 C 1870.81 278.817 1870.66 278.849 1870.5 278.9 C 1864.16 280.949 1860.67 287.756 1862.72 294.102 C 1864.37 299.219 1869.12 302.475 1874.21 302.475 C 1875.44 302.475 1876.69 302.287 1877.93 301.897 C 1878.08 301.848 1878.23 301.781 1878.38 301.726 C 1878.42 301.827 1878.46 301.928 1878.5 302.028 C 1878.36 302.095 1878.21 302.15 1878.07 302.224 C 1872.12 305.249 1869.75 312.52 1872.77 318.467 C 1874.91 322.659 1879.15 325.075 1883.55 325.075 C 1885.39 325.075 1887.26 324.654 1889.01 323.762 C 1889.16 323.689 1889.29 323.603 1889.42 323.527 C 1889.48 323.621 1889.54 323.714 1889.6 323.808 C 1889.47 323.896 1889.33 323.973 1889.2 324.066 C 1883.8 327.974 1882.6 335.528 1886.51 340.939 C 1888.88 344.196 1892.57 345.919 1896.31 345.919 C 1898.76 345.919 1901.24 345.173 1903.39 343.618 C 1903.52 343.524 1903.63 343.419 1903.76 343.321 L 1903.97 343.575 C 1903.85 343.683 1903.73 343.779 1903.62 343.892 C 1898.89 348.598 1898.88 356.257 1903.59 360.985 C 1905.95 363.349 1909.05 364.536 1912.15 364.536 C 1915.24 364.536 1918.32 363.36 1920.68 361.006 C 1920.79 360.894 1920.89 360.774 1921 360.658 L 1921.25 360.872 C 1921.15 360.995 1921.05 361.109 1920.95 361.237 C 1917.01 366.627 1918.19 374.192 1923.59 378.12 C 1925.73 379.696 1928.23 380.443 1930.7 380.443 C 1934.42 380.453 1938.1 378.73 1940.46 375.493 C 1940.56 375.362 1940.64 375.224 1940.73 375.089 C 1940.83 375.149 1940.92 375.211 1941.02 375.27 C 1940.94 375.409 1940.85 375.541 1940.78 375.684 C 1937.73 381.619 1940.09 388.9 1946.02 391.947 C 1947.79 392.85 1949.67 393.272 1951.53 393.272 C 1955.91 393.272 1960.15 390.876 1962.29 386.693 C 1962.36 386.551 1962.41 386.405 1962.48 386.262 C 1962.59 386.307 1962.69 386.349 1962.8 386.394 C 1962.75 386.544 1962.68 386.688 1962.63 386.841 C 1960.56 393.187 1964.03 400.005 1970.37 402.075 C 1971.61 402.474 1972.88 402.673 1974.12 402.673 C 1979.2 402.673 1983.94 399.427 1985.61 394.332 C 1985.66 394.177 1985.69 394.021 1985.73 393.866 C 1985.84 393.892 1985.95 393.918 1986.05 393.944 C 1986.02 394.102 1985.98 394.256 1985.96 394.416 C 1984.91 401.003 1989.4 407.191 1996 408.231 C 1996.63 408.337 1997.27 408.389 1997.89 408.389 C 2003.73 408.389 2008.88 404.145 2009.82 398.188 C 2009.84 398.03 2009.85 397.875 2009.87 397.718 C 2009.98 397.727 2010.09 397.739 2010.2 397.747 C 2010.19 397.901 2010.17 398.053 2010.17 398.208 C 2010.16 404.88 2015.57 410.302 2022.24 410.302 L 2022.25 410.302 C 2028.93 410.302 2034.33 404.901 2034.34 398.23 C 2034.34 398.075 2034.32 397.926 2034.31 397.772 C 2034.42 397.764 2034.53 397.753 2034.65 397.745 C 2034.66 397.899 2034.67 398.053 2034.69 398.208 C 2035.62 404.177 2040.77 408.432 2046.62 408.432 C 2047.24 408.432 2047.86 408.389 2048.5 408.285 C 2055.09 407.255 2059.59 401.077 2058.56 394.479 C 2058.54 394.321 2058.5 394.17 2058.47 394.015 C 2058.57 393.99 2058.68 393.963 2058.79 393.937 C 2058.83 394.093 2058.86 394.249 2058.91 394.405 C 2060.57 399.511 2065.31 402.769 2070.41 402.769 C 2071.64 402.769 2072.89 402.579 2074.12 402.18 C 2080.48 400.121 2083.96 393.302 2081.9 386.956 C 2081.85 386.803 2081.78 386.659 2081.73 386.509 C 2081.83 386.467 2081.94 386.425 2082.04 386.383 C 2082.11 386.527 2082.16 386.676 2082.23 386.82 C 2084.37 391.012 2088.61 393.418 2093.01 393.418 C 2094.85 393.418 2096.73 392.997 2098.49 392.104 C 2104.42 389.069 2106.8 381.797 2103.76 375.852 C 2103.69 375.709 2103.6 375.577 2103.53 375.439 C 2103.62 375.381 2103.71 375.321 2103.81 375.263 C 2103.9 375.396 2103.97 375.532 2104.07 375.662 C 2106.43 378.919 2110.11 380.642 2113.85 380.642 C 2116.31 380.642 2118.8 379.896 2120.94 378.33 C 2126.33 374.413 2127.53 366.858 2123.61 361.458 C 2123.51 361.328 2123.41 361.212 2123.31 361.087 L 2123.56 360.873 C 2123.67 360.99 2123.77 361.113 2123.88 361.227 C 2126.24 363.591 2129.33 364.767 2132.42 364.767 C 2135.51 364.767 2138.6 363.591 2140.97 361.237 C 2145.68 356.52 2145.69 348.871 2140.97 344.155 C 2140.86 344.041 2140.74 343.943 2140.62 343.835 L 2140.84 343.575 C 2140.97 343.673 2141.08 343.777 2141.21 343.87 C 2143.36 345.436 2145.85 346.192 2148.32 346.192 C 2152.05 346.192 2155.73 344.47 2158.09 341.223 C 2162.02 335.832 2160.83 328.279 2155.44 324.339 C 2155.31 324.245 2155.18 324.168 2155.04 324.08 C 2155.1 323.985 2155.16 323.892 2155.22 323.797 C 2155.36 323.875 2155.49 323.962 2155.63 324.035 C 2157.39 324.938 2159.27 325.358 2161.12 325.358 C 2165.52 325.358 2169.75 322.952 2171.88 318.771 C 2174.92 312.835 2172.57 305.554 2166.63 302.518 C 2166.49 302.443 2166.34 302.387 2166.19 302.32 C 2166.23 302.214 2166.28 302.107 2166.32 302.001 C 2166.47 302.057 2166.61 302.122 2166.77 302.172 C 2168.01 302.581 2169.27 302.77 2170.51 302.77 C 2175.59 302.77 2180.33 299.523 2181.99 294.417 C 2184.05 288.071 2180.58 281.253 2174.24 279.194 C 2174.08 279.143 2173.93 279.112 2173.77 279.068 C 2173.8 278.961 2173.82 278.855 2173.85 278.748 C 2174.01 278.78 2174.16 278.822 2174.32 278.848 C 2174.95 278.941 2175.58 278.994 2176.21 278.994 C 2182.06 278.994 2187.19 274.739 2188.13 268.782 C 2189.17 262.194 2184.66 256.006 2178.07 254.976 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2062.98 3726.59 913.54 819.06" width="913.54pt" height="819.06pt"><path d=" M 2950.98 3906.67 L 2950.98 4365.56 C 2950.98 4390.64 2930.65 4410.97 2905.57 4410.97 L 2740.72 4410.97 C 2689.86 4477.32 2609.81 4520.11 2519.75 4520.11 C 2429.69 4520.11 2349.64 4477.32 2298.77 4410.97 L 2133.93 4415.95 C 2108.85 4415.95 2088.52 4395.62 2088.52 4370.55 L 2088.52 3911.66 C 2088.52 3886.58 2108.85 3866.25 2133.93 3866.25 L 2298.77 3861.26 C 2349.64 3794.92 2429.69 3752.13 2519.75 3752.13 C 2609.81 3752.13 2689.86 3794.92 2740.72 3861.26 L 2905.57 3861.26 C 2930.65 3861.26 2950.98 3881.59 2950.98 3906.67 Z  M 2959.49 4365.56 C 2959.49 4395.3 2935.3 4419.48 2905.57 4419.48 L 2744.89 4419.48 C 2690.08 4488.9 2608.27 4528.62 2519.75 4528.62 C 2431.22 4528.62 2349.41 4488.9 2294.61 4419.48 L 2133.93 4424.47 C 2104.2 4424.47 2080.01 4400.28 2080.01 4370.55 L 2080.01 3911.66 C 2080.01 3881.92 2104.2 3857.73 2133.93 3857.73 L 2294.61 3852.75 C 2349.41 3783.33 2431.22 3743.62 2519.75 3743.62 C 2608.27 3743.62 2690.08 3783.33 2744.89 3852.75 L 2905.57 3852.75 C 2935.3 3852.75 2959.49 3876.94 2959.49 3906.67 L 2959.49 4365.56 Z  M 2905.57 3835.72 L 2753 3835.72 C 2695.07 3766.26 2610.53 3726.59 2519.75 3726.59 C 2428.97 3726.59 2344.43 3766.26 2286.5 3835.72 L 2133.93 3840.71 C 2094.81 3840.71 2062.98 3872.53 2062.98 3911.66 L 2062.98 4370.55 C 2062.98 4409.67 2094.81 4441.5 2133.93 4441.5 L 2286.5 4436.51 C 2344.43 4505.98 2428.97 4545.65 2519.75 4545.65 C 2610.53 4545.65 2695.07 4505.98 2753 4436.51 L 2905.57 4436.51 C 2944.69 4436.51 2976.52 4404.69 2976.52 4365.56 L 2976.52 3906.67 C 2976.52 3867.55 2944.69 3835.72 2905.57 3835.72 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="659.218 3730.38 811.472 811.47" width="811.472pt" height="811.47pt"><path d=" M 1445.14 4136.12 C 1445.14 4168.35 1401.33 4194.4 1393.38 4224.13 C 1385.16 4254.9 1409.84 4299.32 1394.25 4326.25 C 1378.45 4353.58 1327.49 4354.31 1305.32 4376.48 C 1283.14 4398.65 1282.41 4449.61 1255.09 4465.42 C 1228.15 4481 1183.73 4456.32 1152.97 4464.54 C 1123.24 4472.49 1097.19 4516.31 1064.95 4516.31 C 1032.72 4516.31 1006.67 4472.49 976.935 4464.54 C 946.172 4456.32 901.75 4481 874.816 4465.42 C 847.494 4449.61 846.761 4398.65 824.588 4376.48 C 802.415 4354.31 751.458 4353.57 735.65 4326.25 C 720.067 4299.32 744.749 4254.9 736.527 4224.13 C 728.58 4194.4 684.76 4168.35 684.76 4136.12 C 684.76 4103.88 728.58 4077.83 736.526 4048.1 C 744.749 4017.34 720.067 3972.91 735.651 3945.98 C 751.458 3918.66 802.416 3917.92 824.589 3895.75 C 846.762 3873.58 847.496 3822.62 874.817 3806.81 C 901.751 3791.23 946.172 3815.91 976.935 3807.69 C 1006.67 3799.74 1032.72 3755.92 1064.95 3755.92 C 1097.19 3755.92 1123.24 3799.74 1152.97 3807.69 C 1183.73 3815.91 1228.15 3791.23 1255.09 3806.81 C 1282.41 3822.62 1283.14 3873.58 1305.32 3895.75 C 1327.49 3917.93 1378.45 3918.66 1394.25 3945.98 C 1409.84 3972.92 1385.16 4017.34 1393.38 4048.1 C 1401.33 4077.83 1445.14 4103.88 1445.14 4136.12 Z  M 1401.6 4226.33 C 1398.39 4238.36 1401.24 4254.29 1403.99 4269.69 C 1407.8 4290.99 1411.74 4313.02 1401.62 4330.52 C 1391.33 4348.31 1370.08 4355.93 1349.54 4363.3 C 1334.3 4368.76 1319.91 4373.92 1311.34 4382.5 C 1302.76 4391.08 1297.6 4405.47 1292.13 4420.7 C 1284.76 4441.25 1277.14 4462.5 1259.35 4472.79 C 1251.88 4477.11 1242.94 4479.21 1232.04 4479.21 C 1221.2 4479.21 1209.68 4477.15 1198.53 4475.16 C 1188.01 4473.28 1177.14 4471.33 1167.62 4471.33 C 1162.86 4471.33 1158.79 4471.8 1155.17 4472.77 C 1143.85 4475.79 1132.41 4485.5 1120.29 4495.78 C 1103.45 4510.06 1086.04 4524.82 1064.95 4524.82 C 1043.87 4524.82 1026.45 4510.06 1009.61 4495.78 C 997.497 4485.5 986.052 4475.79 974.736 4472.77 C 971.12 4471.8 967.045 4471.33 962.284 4471.33 C 952.769 4471.33 941.893 4473.27 931.377 4475.16 C 920.23 4477.15 908.705 4479.21 897.867 4479.21 C 886.961 4479.21 878.027 4477.11 870.553 4472.79 C 852.763 4462.5 845.141 4441.25 837.77 4420.7 C 832.305 4405.46 827.143 4391.08 818.568 4382.5 C 809.99 4373.92 795.601 4368.76 780.366 4363.3 C 759.82 4355.93 738.572 4348.31 728.28 4330.52 C 718.159 4313.02 722.1 4290.99 725.912 4269.69 C 728.667 4254.29 731.518 4238.36 728.301 4226.33 C 725.276 4215.02 715.57 4203.57 705.294 4191.45 C 691.012 4174.62 676.246 4157.2 676.246 4136.12 C 676.246 4115.03 691.012 4097.62 705.294 4080.78 C 715.57 4068.66 725.276 4057.22 728.301 4045.9 C 731.518 4033.87 728.667 4017.94 725.912 4002.54 C 722.102 3981.24 718.16 3959.21 728.282 3941.72 C 738.574 3923.93 759.821 3916.3 780.367 3908.94 C 795.602 3903.47 809.992 3898.31 818.568 3889.73 C 827.145 3881.15 832.306 3866.77 837.77 3851.53 C 845.142 3830.99 852.764 3809.74 870.554 3799.45 C 878.027 3795.12 886.961 3793.02 897.865 3793.02 C 908.705 3793.02 920.23 3795.08 931.377 3797.08 C 941.892 3798.96 952.764 3800.9 962.28 3800.9 C 967.043 3800.9 971.117 3800.43 974.735 3799.46 C 986.054 3796.44 997.499 3786.73 1009.62 3776.46 C 1026.46 3762.18 1043.87 3747.41 1064.95 3747.41 C 1086.04 3747.41 1103.45 3762.18 1120.29 3776.46 C 1132.41 3786.74 1143.85 3796.44 1155.17 3799.46 C 1158.79 3800.43 1162.86 3800.9 1167.63 3800.9 C 1177.14 3800.9 1188.01 3798.96 1198.53 3797.08 C 1209.68 3795.08 1221.2 3793.02 1232.04 3793.02 C 1242.95 3793.02 1251.88 3795.12 1259.35 3799.45 C 1277.14 3809.74 1284.76 3830.99 1292.14 3851.53 C 1297.6 3866.77 1302.76 3881.16 1311.34 3889.73 C 1319.91 3898.31 1334.3 3903.47 1349.54 3908.94 C 1370.09 3916.31 1391.33 3923.93 1401.63 3941.72 C 1411.75 3959.21 1407.81 3981.24 1403.99 4002.54 C 1401.24 4017.94 1398.39 4033.87 1401.6 4045.9 C 1404.63 4057.21 1414.33 4068.66 1424.61 4080.78 C 1438.89 4097.62 1453.66 4115.03 1453.66 4136.12 C 1453.66 4157.2 1438.89 4174.62 1424.61 4191.45 C 1414.33 4203.57 1404.63 4215.02 1401.6 4226.33 Z  M 1437.6 4202.46 C 1453.11 4184.18 1470.69 4163.45 1470.69 4136.12 C 1470.69 4108.78 1453.11 4088.05 1437.59 4069.76 C 1428.99 4059.61 1420.09 4049.12 1418.05 4041.51 C 1415.82 4033.14 1418.44 4018.48 1420.75 4005.54 C 1424.9 3982.36 1429.61 3956.08 1416.36 3933.19 C 1402.95 3910.01 1377.63 3900.92 1355.27 3892.9 C 1342.48 3888.31 1329.25 3883.57 1323.38 3877.69 C 1317.5 3871.82 1312.76 3858.59 1308.16 3845.78 C 1300.15 3823.44 1291.06 3798.12 1267.88 3784.71 C 1257.74 3778.84 1246.02 3775.99 1232.04 3775.99 C 1219.68 3775.99 1207.4 3778.19 1195.53 3780.31 C 1185.75 3782.07 1175.63 3783.88 1167.63 3783.88 C 1164.37 3783.88 1161.73 3783.59 1159.56 3783.01 C 1151.94 3780.98 1141.45 3772.08 1131.3 3763.47 C 1113.02 3747.96 1092.29 3730.38 1064.95 3730.38 C 1037.62 3730.38 1016.89 3747.96 998.586 3763.48 C 988.443 3772.09 977.956 3780.98 970.337 3783.01 C 968.171 3783.59 965.535 3783.88 962.28 3783.88 C 954.274 3783.88 944.159 3782.07 934.377 3780.31 C 922.502 3778.19 910.224 3775.99 897.865 3775.99 C 883.888 3775.99 872.164 3778.84 862.027 3784.71 C 838.844 3798.12 829.761 3823.44 821.741 3845.79 C 817.153 3858.58 812.407 3871.81 806.526 3877.69 C 800.652 3883.57 787.424 3888.31 774.618 3892.91 C 752.278 3900.92 726.957 3910 713.543 3933.19 C 700.302 3956.08 705.003 3982.35 709.152 4005.55 C 711.466 4018.48 714.087 4033.14 711.851 4041.5 C 709.813 4049.13 700.914 4059.62 692.308 4069.77 C 676.797 4088.05 659.218 4108.78 659.218 4136.12 C 659.218 4163.45 676.797 4184.18 692.308 4202.47 C 700.914 4212.61 709.813 4223.11 711.851 4230.73 C 714.086 4239.1 711.466 4253.75 709.15 4266.69 C 705.001 4289.88 700.299 4316.16 713.542 4339.04 C 726.956 4362.23 752.277 4371.31 774.629 4379.33 C 787.422 4383.92 800.65 4388.66 806.527 4394.54 C 812.403 4400.42 817.15 4413.65 821.744 4426.45 C 829.758 4448.79 838.84 4474.11 862.022 4487.53 C 872.157 4493.39 883.882 4496.24 897.867 4496.24 C 910.224 4496.24 922.502 4494.04 934.377 4491.92 C 944.152 4490.17 954.261 4488.36 962.284 4488.36 C 965.546 4488.36 968.179 4488.64 970.341 4489.22 C 977.956 4491.25 988.445 4500.15 998.6 4508.76 C 1016.89 4524.27 1037.62 4541.85 1064.95 4541.85 C 1092.29 4541.85 1113.02 4524.27 1131.32 4508.75 C 1141.46 4500.15 1151.95 4491.25 1159.57 4489.22 C 1161.73 4488.64 1164.36 4488.36 1167.62 4488.36 C 1175.61 4488.36 1185.72 4490.17 1195.53 4491.92 C 1207.4 4494.04 1219.69 4496.24 1232.04 4496.24 C 1246.02 4496.24 1257.74 4493.39 1267.88 4487.53 C 1291.07 4474.11 1300.15 4448.79 1308.17 4426.44 C 1312.75 4413.65 1317.5 4400.42 1323.38 4394.54 C 1329.25 4388.67 1342.48 4383.92 1355.29 4379.32 C 1377.63 4371.31 1402.95 4362.23 1416.36 4339.05 C 1429.6 4316.16 1424.9 4289.88 1420.75 4266.69 C 1418.44 4253.75 1415.82 4239.1 1418.05 4230.73 C 1420.09 4223.11 1428.99 4212.62 1437.6 4202.46 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="3658.1 2643.15 639.23 802.21" width="639.23pt" height="802.21pt"><path d=" M 3729.05 2668.69 L 4226.38 2668.69 C 4251.46 2668.69 4271.79 2689.02 4271.79 2714.1 L 4271.79 3215.85 C 4271.79 3231.37 4263.87 3245.8 4250.79 3254.14 L 4002.13 3412.7 C 3987.24 3422.19 3968.19 3422.19 3953.3 3412.7 L 3704.64 3254.14 C 3691.56 3245.8 3683.64 3231.37 3683.64 3215.85 L 3683.64 2714.1 C 3683.64 2689.02 3703.97 2668.69 3729.05 2668.69 Z  M 4280.3 3215.85 C 4280.3 3234.37 4270.98 3251.37 4255.37 3261.32 L 4006.7 3419.88 C 3998.03 3425.41 3988 3428.33 3977.71 3428.33 C 3967.42 3428.33 3957.4 3425.41 3948.72 3419.88 L 3700.06 3261.32 C 3684.45 3251.37 3675.13 3234.37 3675.13 3215.85 L 3675.13 2714.1 C 3675.13 2684.37 3699.32 2660.18 3729.05 2660.18 L 4226.38 2660.18 C 4256.11 2660.18 4280.3 2684.37 4280.3 2714.1 L 4280.3 3215.85 Z  M 4226.38 2643.15 L 3729.05 2643.15 C 3689.93 2643.15 3658.1 2674.98 3658.1 2714.1 L 3658.1 3215.85 C 3658.1 3240.22 3670.36 3262.58 3690.9 3275.68 L 3939.57 3434.23 C 3950.99 3441.51 3964.18 3445.36 3977.71 3445.36 C 3991.25 3445.36 4004.44 3441.51 4015.86 3434.23 L 4264.53 3275.68 C 4285.07 3262.58 4297.33 3240.22 4297.33 3215.85 L 4297.33 2714.1 C 4297.33 2674.98 4265.5 2643.15 4226.38 2643.15 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="658.898 2638.21 812.082 812.09" width="812.082pt" height="812.09pt"><path d=" M 1445.44 3044.25 C 1445.44 3254.4 1275.08 3424.75 1064.94 3424.75 C 854.795 3424.75 684.44 3254.4 684.44 3044.25 C 684.44 2834.11 854.795 2663.75 1064.94 2663.75 C 1275.08 2663.75 1445.44 2834.11 1445.44 3044.25 Z  M 1064.94 3433.27 C 850.438 3433.27 675.926 3258.76 675.926 3044.25 C 675.926 2829.75 850.438 2655.24 1064.94 2655.24 C 1279.44 2655.24 1453.95 2829.75 1453.95 3044.25 C 1453.95 3258.76 1279.44 3433.27 1064.94 3433.27 Z  M 1064.94 2638.21 C 841.048 2638.21 658.898 2820.36 658.898 3044.25 C 658.898 3268.15 841.048 3450.3 1064.94 3450.3 C 1288.83 3450.3 1470.98 3268.15 1470.98 3044.25 C 1470.98 2820.36 1288.83 2638.21 1064.94 2638.21 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2637.31 2554.24 2372.7 506.56" width="2372.7pt" height="506.56pt"><path d=" M 2905.76 2965.55 L 2905.76 2554.24 L 4741.57 2554.24 L 4741.57 2965.55 L 2905.76 2965.55 Z  M 2990.36 2985.55 L 3331.96 3058.44 L 3331.96 2985.55 L 2990.36 2985.55 Z  M 3331.92 3058.43 C 3331.65 3042.14 3331.22 3012.59 3331.15 2985.55 L 2990.36 2985.55 L 3331.92 3058.43 Z  M 2885.63 2974.5 C 2885.66 2974.23 2885.7 2973.96 2885.75 2973.7 L 2885.75 2686.96 L 2637.31 2686.96 L 2810.59 2866.46 C 2814.24 2870.24 2814.34 2876.2 2810.82 2880.1 L 2647.74 3060.8 L 3247.18 3060.8 L 2893.49 2985.33 C 2888.48 2984.26 2885.09 2979.59 2885.63 2974.5 Z  M 4399.96 3060.8 L 4999.58 3060.8 L 4836.5 2880.1 C 4832.98 2876.2 4833.08 2870.24 4836.73 2866.46 L 5010.01 2686.96 L 4761.57 2686.96 L 4761.57 2975.45 C 4761.57 2975.45 4761.57 2975.46 4761.57 2975.46 L 4761.57 2975.55 C 4761.57 2975.63 4761.56 2975.7 4761.56 2975.78 C 4761.55 2975.88 4761.54 2975.99 4761.54 2976.1 C 4761.52 2976.54 4761.47 2976.98 4761.39 2977.41 C 4761.39 2977.42 4761.38 2977.43 4761.38 2977.44 L 4761.38 2977.44 C 4761.35 2977.6 4761.32 2977.75 4761.28 2977.9 C 4761.24 2978.05 4761.21 2978.2 4761.16 2978.35 C 4761.16 2978.36 4761.16 2978.36 4761.16 2978.36 C 4761 2978.92 4760.78 2979.46 4760.53 2979.97 C 4760.51 2980.01 4760.49 2980.05 4760.47 2980.09 C 4760.47 2980.09 4760.47 2980.09 4760.47 2980.09 C 4760.26 2980.5 4760.02 2980.9 4759.75 2981.28 C 4759.75 2981.29 4759.75 2981.29 4759.75 2981.29 C 4759.66 2981.42 4759.56 2981.55 4759.46 2981.68 C 4759.46 2981.68 4759.46 2981.68 4759.46 2981.68 C 4759.37 2981.79 4759.29 2981.91 4759.19 2982.01 C 4759.19 2982.01 4759.19 2982.01 4759.19 2982.01 C 4759.09 2982.14 4758.97 2982.26 4758.86 2982.38 C 4758.76 2982.48 4758.67 2982.59 4758.57 2982.69 L 4758.57 2982.69 C 4758.56 2982.69 4758.56 2982.69 4758.56 2982.69 C 4758.12 2983.13 4757.64 2983.52 4757.12 2983.87 L 4757.12 2983.87 C 4757.06 2983.91 4756.99 2983.95 4756.93 2983.98 C 4756.72 2984.11 4756.52 2984.24 4756.31 2984.36 C 4756.31 2984.36 4756.31 2984.36 4756.31 2984.36 C 4756.18 2984.43 4756.04 2984.49 4755.91 2984.55 C 4755.57 2984.71 4755.22 2984.86 4754.86 2984.98 C 4754.86 2984.99 4754.85 2984.99 4754.85 2984.99 C 4754.5 2985.11 4754.16 2985.21 4753.8 2985.29 C 4753.75 2985.31 4753.7 2985.32 4753.65 2985.33 L 4753.63 2985.34 L 4753.63 2985.34 C 4753.6 2985.34 4753.58 2985.35 4753.55 2985.36 C 4753.55 2985.36 4753.55 2985.36 4753.55 2985.36 L 4399.96 3060.8 Z  M 4316.17 2985.55 L 4656.78 2985.55 L 4315.41 3058.4 C 4315.67 3042.09 4316.1 3012.57 4316.17 2985.55 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2633.89 1311.775 2379.54 600.086" width="2379.54pt" height="600.086pt"><path d=" M 4661.22 1369.08 C 4562.6 1332.71 4377.18 1302.26 4053.92 1363.73 C 3994.38 1375.05 3933.53 1388.59 3873.06 1403.96 C 3872.94 1403.99 3872.81 1404.02 3872.68 1404.05 C 3828.92 1413.33 3784.34 1423.83 3740.16 1435.26 C 3739.61 1435.51 3739.03 1435.71 3738.43 1435.86 C 3678.68 1450.73 3621.14 1462.15 3567.41 1469.78 C 3403.91 1492.99 3265.25 1494.96 3155.27 1475.63 C 3112.62 1468.14 3075.65 1457.59 3045.37 1444.28 C 3021.21 1433.66 3002.11 1421.55 2989.94 1409.18 C 2967.44 1512.63 2918.1 1736.67 2917.43 1739.68 C 2906.74 1788.47 2934.98 1835.7 2986.1 1854.56 C 3084.72 1890.92 3270.14 1921.37 3593.4 1859.9 C 3652.93 1848.58 3713.78 1835.05 3774.26 1819.68 C 3774.38 1819.64 3774.51 1819.61 3774.64 1819.59 C 3818.39 1810.31 3862.97 1799.81 3907.16 1788.38 C 3907.71 1788.13 3908.29 1787.93 3908.89 1787.78 C 3968.64 1772.9 4026.18 1761.49 4079.91 1753.86 C 4243.41 1730.64 4382.07 1728.67 4492.05 1748 C 4534.7 1755.5 4571.68 1766.05 4601.96 1779.36 C 4626.11 1789.98 4645.21 1802.08 4657.38 1814.46 C 4679.91 1710.87 4729.34 1486.42 4729.89 1483.94 C 4740.58 1435.17 4712.35 1387.93 4661.22 1369.08 Z  M 3400.9 1466.47 C 3402.4 1452.73 3403.54 1438.97 3404.37 1427.24 C 3396.65 1430.59 3387.17 1432.08 3376.23 1432.08 C 3337.77 1432.09 3281.08 1413.74 3218.09 1393.36 C 3136.12 1366.84 3043.22 1336.78 3009.08 1358.52 C 3001.56 1363.31 2997.26 1370.76 2995.94 1381.31 C 2995.91 1381.59 2995.86 1381.87 2995.8 1382.14 C 2995.73 1383.04 2996.66 1386.5 3001.26 1391.94 C 3001.3 1391.99 3001.34 1392.03 3001.38 1392.07 C 3001.62 1392.36 3001.89 1392.66 3002.16 1392.96 C 3002.28 1393.1 3002.39 1393.23 3002.52 1393.37 C 3002.76 1393.63 3003.01 1393.9 3003.27 1394.17 C 3003.5 1394.42 3003.72 1394.66 3003.97 1394.91 C 3004.06 1395.01 3004.16 1395.1 3004.26 1395.2 C 3004.6 1395.55 3004.95 1395.9 3005.32 1396.26 C 3005.93 1396.85 3006.6 1397.47 3007.33 1398.13 C 3017.41 1407.19 3046.62 1428.63 3111 1445.58 C 3111.53 1445.72 3112.07 1445.86 3112.61 1446 C 3113.18 1446.15 3113.75 1446.3 3114.32 1446.44 C 3116.65 1447.04 3119.01 1447.62 3121.42 1448.21 C 3126.13 1449.34 3130.91 1450.43 3135.77 1451.47 C 3135.77 1451.47 3135.77 1451.47 3135.78 1451.47 C 3137.86 1451.92 3139.96 1452.35 3142.06 1452.78 C 3142.92 1452.96 3143.79 1453.13 3144.66 1453.3 C 3145.55 1453.48 3146.46 1453.66 3147.37 1453.83 C 3153.1 1454.94 3159.03 1456.02 3165.19 1457.04 C 3187.07 1460.67 3210.11 1463.46 3234.26 1465.41 C 3234.66 1465.44 3235.06 1465.47 3235.46 1465.5 C 3237.29 1465.65 3239.13 1465.79 3240.97 1465.92 C 3243.35 1466.1 3245.74 1466.27 3248.14 1466.42 C 3248.14 1466.42 3248.14 1466.42 3248.14 1466.42 C 3294.82 1469.48 3345.85 1469.5 3400.9 1466.47 Z  M 4246.42 1757.16 C 4244.92 1770.9 4243.79 1784.66 4242.95 1796.39 C 4250.67 1793.04 4260.15 1791.55 4271.09 1791.55 C 4309.55 1791.55 4366.25 1809.89 4429.23 1830.27 C 4491.46 1850.4 4559.99 1872.58 4604.33 1872.58 C 4618.39 1872.58 4630.01 1870.35 4638.24 1865.12 C 4645.76 1860.32 4650.06 1852.87 4651.38 1842.32 C 4651.41 1842.05 4651.46 1841.77 4651.52 1841.49 C 4651.59 1840.59 4650.66 1837.15 4646.08 1831.72 C 4646.03 1831.67 4645.99 1831.61 4645.94 1831.55 C 4645.7 1831.27 4645.45 1830.98 4645.19 1830.7 C 4645.06 1830.55 4644.93 1830.4 4644.79 1830.25 C 4644.56 1830 4644.32 1829.74 4644.08 1829.48 C 4643.83 1829.22 4643.59 1828.96 4643.33 1828.7 C 4643.25 1828.62 4643.17 1828.54 4643.09 1828.45 C 4642.74 1828.1 4642.37 1827.73 4641.99 1827.36 C 4641.38 1826.78 4640.72 1826.16 4640 1825.51 C 4629.93 1816.46 4600.71 1795 4536.28 1778.04 C 4536.16 1778.01 4536.03 1777.98 4535.91 1777.94 C 4534.93 1777.69 4533.95 1777.43 4532.95 1777.18 C 4530.64 1776.59 4528.29 1776.01 4525.9 1775.43 C 4521.21 1774.3 4516.46 1773.22 4511.63 1772.18 C 4511.59 1772.17 4511.54 1772.16 4511.5 1772.15 C 4509.44 1771.71 4507.36 1771.28 4505.28 1770.86 C 4504.4 1770.68 4503.52 1770.5 4502.63 1770.32 C 4501.76 1770.15 4500.89 1769.98 4500.03 1769.82 C 4494.27 1768.7 4488.32 1767.62 4482.13 1766.6 C 4460.28 1762.97 4437.29 1760.18 4413.18 1758.24 C 4412.66 1758.19 4412.13 1758.15 4411.6 1758.11 C 4409.89 1757.98 4408.17 1757.84 4406.45 1757.72 C 4357.8 1754.17 4304.34 1753.98 4246.42 1757.16 Z  M 3383.1 1355.22 C 3352.07 1336.97 3294.79 1324.24 3212.85 1317.36 C 3143.31 1311.53 3057.11 1310.23 2963.57 1313.62 C 2882.28 1316.56 2800.5 1322.83 2733.29 1331.26 C 2679.12 1338.05 2648.87 1344.49 2633.89 1349.1 C 2731.19 1383.59 2877.46 1456.56 2905.35 1526.59 C 2906.33 1529.06 2906.29 1531.82 2905.24 1534.26 C 2904.18 1536.7 2902.2 1538.62 2899.73 1539.59 C 2854.79 1557.31 2802.04 1588.89 2755.01 1626.22 C 2715.7 1657.42 2696.26 1679.82 2689.65 1690.44 C 2691.41 1690.02 2693.61 1689.38 2696.33 1688.45 C 2766.54 1664.39 2883.05 1661.05 2914.36 1660.59 C 2920.09 1634.52 2926.85 1603.8 2933.82 1572.03 C 2934.05 1570.97 2934.29 1569.91 2934.52 1568.85 C 2934.58 1568.56 2934.65 1568.26 2934.71 1567.97 C 2934.86 1567.32 2935 1566.67 2935.14 1566.02 C 2935.36 1565.01 2935.58 1564.01 2935.8 1563 C 2951.45 1491.75 2968 1416.15 2976.16 1378.35 C 2978.32 1361.99 2985.78 1349.65 2998.34 1341.65 C 3017.97 1329.15 3048.99 1327.82 3095.95 1337.46 C 3135.17 1345.51 3180.45 1360.16 3224.24 1374.33 C 3295.04 1397.24 3375.29 1423.21 3399.44 1407.28 C 3402.03 1405.57 3405.57 1402.37 3406.3 1394.44 C 3406.31 1394.38 3406.32 1394.32 3406.33 1394.26 C 3406.35 1394.07 3406.37 1393.89 3406.41 1393.7 C 3406.43 1393.57 3406.45 1393.44 3406.47 1393.31 C 3406.48 1393.27 3406.49 1393.23 3406.5 1393.19 C 3408.54 1383.99 3408.33 1370.06 3383.1 1355.22 Z  M 3376.23 1432.08 C 3337.77 1432.09 3281.08 1413.74 3218.09 1393.36 C 3136.12 1366.84 3043.22 1336.78 3009.08 1358.52 C 3001.56 1363.31 2997.26 1370.76 2995.94 1381.31 C 2995.91 1381.59 2995.86 1381.87 2995.8 1382.14 C 2995.75 1382.76 2996.17 1384.58 2997.92 1387.41 C 2997.93 1387.43 2997.95 1387.44 2997.96 1387.46 C 2998.1 1387.69 2998.25 1387.92 2998.41 1388.16 C 2998.45 1388.22 2998.49 1388.28 2998.53 1388.34 C 2998.68 1388.56 2998.83 1388.79 2999 1389.02 C 2999.05 1389.1 2999.11 1389.19 2999.17 1389.27 C 2999.33 1389.5 2999.5 1389.72 2999.68 1389.96 C 2999.74 1390.04 2999.81 1390.12 2999.87 1390.2 C 3000.29 1390.76 3000.75 1391.34 3001.26 1391.94 C 3001.3 1391.98 3001.33 1392.02 3001.36 1392.06 C 3001.59 1392.33 3001.84 1392.61 3002.09 1392.89 C 3002.11 1392.91 3002.13 1392.94 3002.16 1392.96 C 3002.28 1393.1 3002.39 1393.23 3002.52 1393.37 C 3002.73 1393.61 3002.97 1393.85 3003.2 1394.1 C 3003.22 1394.12 3003.24 1394.15 3003.27 1394.17 C 3003.5 1394.42 3003.72 1394.66 3003.97 1394.91 C 3004.06 1395.01 3004.16 1395.1 3004.26 1395.2 C 3004.6 1395.55 3004.95 1395.9 3005.32 1396.26 C 3005.32 1396.26 3005.32 1396.26 3005.32 1396.26 C 3005.93 1396.85 3006.6 1397.47 3007.33 1398.13 C 3017.41 1407.18 3046.61 1428.62 3110.97 1445.57 C 3111.92 1445.82 3112.88 1446.07 3113.85 1446.32 C 3113.99 1446.36 3114.13 1446.39 3114.27 1446.43 C 3116.61 1447.03 3118.99 1447.62 3121.42 1448.2 C 3128.15 1449.83 3135.04 1451.35 3142.07 1452.78 C 3142.92 1452.95 3143.77 1453.13 3144.63 1453.3 C 3145.55 1453.48 3146.47 1453.66 3147.39 1453.84 C 3153.12 1454.95 3159.04 1456.02 3165.19 1457.04 C 3187.05 1460.67 3210.05 1463.45 3234.17 1465.4 C 3234.67 1465.44 3235.17 1465.48 3235.66 1465.52 C 3237.39 1465.65 3239.13 1465.79 3240.86 1465.92 C 3241.02 1465.93 3241.17 1465.94 3241.32 1465.95 C 3244.15 1466.15 3247 1466.35 3249.86 1466.53 C 3250.25 1466.55 3250.63 1466.57 3251.02 1466.6 C 3253.65 1466.76 3256.28 1466.92 3258.94 1467.06 C 3259.5 1467.09 3260.07 1467.12 3260.63 1467.15 C 3263.11 1467.28 3265.61 1467.41 3268.12 1467.52 C 3268.82 1467.56 3269.52 1467.59 3270.22 1467.62 C 3272.6 1467.72 3274.98 1467.82 3277.38 1467.91 C 3278.2 1467.94 3279.04 1467.97 3279.87 1468 C 3282.15 1468.08 3284.43 1468.15 3286.73 1468.22 C 3287.67 1468.25 3288.61 1468.27 3289.54 1468.3 C 3291.75 1468.36 3293.97 1468.41 3296.19 1468.46 C 3297.22 1468.48 3298.25 1468.5 3299.29 1468.52 C 3301.43 1468.55 3303.57 1468.59 3305.72 1468.62 C 3306.85 1468.63 3307.98 1468.64 3309.11 1468.66 C 3311.18 1468.68 3313.27 1468.69 3315.36 1468.7 C 3316.57 1468.71 3317.78 1468.71 3318.99 1468.72 C 3321.02 1468.72 3323.05 1468.72 3325.09 1468.71 C 3326.38 1468.71 3327.67 1468.71 3328.96 1468.7 C 3330.93 1468.69 3332.91 1468.67 3334.89 1468.65 C 3336.27 1468.64 3337.63 1468.63 3339.01 1468.61 C 3340.94 1468.58 3342.88 1468.55 3344.81 1468.52 C 3346.25 1468.49 3347.69 1468.47 3349.13 1468.44 C 3351.03 1468.4 3352.95 1468.35 3354.86 1468.31 C 3356.35 1468.27 3357.83 1468.24 3359.33 1468.2 C 3361.21 1468.14 3363.1 1468.08 3364.99 1468.02 C 3366.54 1467.98 3368.07 1467.93 3369.62 1467.88 C 3371.49 1467.81 3373.38 1467.74 3375.26 1467.67 C 3376.83 1467.6 3378.4 1467.55 3379.99 1467.48 C 3381.93 1467.4 3383.9 1467.31 3385.85 1467.22 C 3387.38 1467.15 3388.9 1467.09 3390.43 1467.01 C 3393.11 1466.88 3395.8 1466.74 3398.5 1466.6 C 3399.3 1466.56 3400.08 1466.52 3400.88 1466.48 C 3401.69 1459.06 3402.41 1451.49 3403.08 1443.8 C 3403.57 1438.01 3404 1432.42 3404.37 1427.24 C 3396.65 1430.59 3387.17 1432.08 3376.23 1432.08 Z  M 4264.22 1868.41 C 4295.25 1886.66 4352.53 1899.4 4434.47 1906.27 C 4504.01 1912.11 4590.21 1913.4 4683.75 1910.02 C 4765.04 1907.07 4846.82 1900.81 4914.03 1892.38 C 4968.2 1885.58 4998.45 1879.14 5013.43 1874.54 C 4916.13 1840.04 4769.85 1767.07 4741.97 1697.04 C 4740.99 1694.57 4741.03 1691.82 4742.08 1689.38 C 4743.14 1686.94 4745.12 1685.02 4747.59 1684.04 C 4792.53 1666.32 4845.28 1634.75 4892.31 1597.42 C 4931.62 1566.21 4951.06 1543.81 4957.67 1533.19 C 4955.91 1533.62 4953.71 1534.25 4950.99 1535.18 C 4880.77 1559.24 4764.26 1562.58 4732.96 1563.05 C 4722.38 1611.15 4708.33 1675.1 4695.82 1732.18 C 4685.72 1778.29 4676.59 1820.1 4671.15 1845.3 C 4669 1861.65 4661.54 1873.99 4648.98 1881.99 C 4637.94 1889.01 4623.3 1892.51 4604.25 1892.51 C 4589.42 1892.51 4571.92 1890.39 4551.37 1886.17 C 4512.16 1878.12 4466.87 1863.47 4423.08 1849.3 C 4352.28 1826.39 4272.03 1800.43 4247.88 1816.36 C 4245.29 1818.07 4241.75 1821.26 4241.02 1829.2 C 4241.01 1829.25 4241 1829.31 4240.99 1829.37 C 4240.97 1829.56 4240.95 1829.75 4240.91 1829.94 C 4240.89 1830.07 4240.87 1830.19 4240.85 1830.32 C 4240.84 1830.36 4240.83 1830.4 4240.82 1830.45 C 4238.78 1839.64 4238.99 1853.58 4264.22 1868.41 Z  M 4271.09 1791.55 C 4309.55 1791.55 4366.25 1809.89 4429.23 1830.27 C 4491.46 1850.4 4559.99 1872.58 4604.33 1872.58 C 4618.39 1872.58 4630.01 1870.35 4638.24 1865.12 C 4645.76 1860.32 4650.06 1852.87 4651.38 1842.32 C 4651.41 1842.05 4651.46 1841.77 4651.52 1841.49 C 4651.57 1840.82 4651.07 1838.73 4648.9 1835.45 C 4648.88 1835.42 4648.86 1835.38 4648.83 1835.35 C 4648.67 1835.11 4648.5 1834.86 4648.32 1834.6 C 4648.28 1834.55 4648.25 1834.5 4648.21 1834.45 C 4648.03 1834.2 4647.84 1833.93 4647.64 1833.67 C 4647.63 1833.66 4647.63 1833.65 4647.62 1833.65 C 4647.16 1833.04 4646.65 1832.4 4646.08 1831.72 C 4646.04 1831.67 4645.99 1831.61 4645.94 1831.56 C 4645.82 1831.41 4645.67 1831.25 4645.54 1831.09 C 4645.42 1830.96 4645.31 1830.83 4645.19 1830.7 C 4645.06 1830.55 4644.93 1830.41 4644.8 1830.26 C 4644.57 1830.01 4644.32 1829.75 4644.07 1829.48 C 4643.83 1829.22 4643.59 1828.96 4643.33 1828.7 C 4643.26 1828.63 4643.19 1828.56 4643.12 1828.49 C 4643.11 1828.47 4643.09 1828.46 4643.08 1828.44 C 4642.73 1828.09 4642.37 1827.73 4641.99 1827.37 C 4641.99 1827.36 4641.98 1827.36 4641.97 1827.35 C 4641.38 1826.77 4640.72 1826.16 4640 1825.51 C 4640 1825.51 4640 1825.51 4640 1825.51 C 4629.92 1816.46 4600.71 1795.01 4536.29 1778.04 C 4536.16 1778.01 4536.02 1777.97 4535.89 1777.94 C 4534.92 1777.69 4533.95 1777.43 4532.97 1777.18 C 4532.69 1777.11 4532.41 1777.04 4532.14 1776.97 C 4531.25 1776.75 4530.37 1776.53 4529.48 1776.3 C 4528.29 1776.01 4527.1 1775.72 4525.9 1775.43 C 4523.56 1774.86 4521.19 1774.31 4518.81 1773.77 C 4516.52 1773.25 4514.21 1772.74 4511.88 1772.24 C 4511.8 1772.22 4511.71 1772.2 4511.63 1772.18 C 4511.59 1772.17 4511.54 1772.16 4511.5 1772.15 C 4511.4 1772.13 4511.29 1772.11 4511.18 1772.09 C 4509.23 1771.67 4507.26 1771.26 4505.28 1770.86 C 4504.4 1770.68 4503.52 1770.5 4502.63 1770.32 C 4501.76 1770.15 4500.89 1769.98 4500.03 1769.82 C 4494.27 1768.7 4488.32 1767.62 4482.13 1766.6 C 4460.29 1762.97 4437.29 1760.18 4413.19 1758.24 C 4412.66 1758.19 4412.13 1758.15 4411.59 1758.11 C 4409.89 1757.98 4408.17 1757.84 4406.46 1757.72 C 4400.42 1757.28 4394.31 1756.89 4388.13 1756.55 C 4387.96 1756.55 4387.79 1756.54 4387.63 1756.53 C 4384.73 1756.37 4381.83 1756.23 4378.91 1756.09 C 4378.58 1756.08 4378.25 1756.07 4377.92 1756.05 C 4375.16 1755.93 4372.39 1755.81 4369.6 1755.71 C 4369.13 1755.69 4368.66 1755.68 4368.19 1755.66 C 4365.54 1755.57 4362.87 1755.48 4360.19 1755.4 C 4359.61 1755.38 4359.03 1755.37 4358.45 1755.35 C 4355.86 1755.28 4353.27 1755.22 4350.66 1755.17 C 4350 1755.15 4349.33 1755.14 4348.66 1755.13 C 4346.13 1755.08 4343.59 1755.04 4341.05 1755.01 C 4340.29 1755 4339.54 1754.99 4338.79 1754.98 C 4336.32 1754.96 4333.84 1754.94 4331.35 1754.93 C 4330.51 1754.92 4329.68 1754.92 4328.84 1754.92 C 4326.41 1754.91 4323.97 1754.91 4321.52 1754.92 C 4320.63 1754.92 4319.73 1754.92 4318.83 1754.93 C 4316.44 1754.94 4314.03 1754.96 4311.62 1754.99 C 4310.66 1755 4309.7 1755.01 4308.74 1755.02 C 4306.36 1755.05 4303.97 1755.09 4301.58 1755.13 C 4300.57 1755.15 4299.57 1755.16 4298.56 1755.19 C 4296.19 1755.23 4293.81 1755.29 4291.43 1755.35 C 4290.39 1755.38 4289.35 1755.4 4288.3 1755.43 C 4285.92 1755.49 4283.51 1755.57 4281.11 1755.65 C 4280.06 1755.68 4279.02 1755.71 4277.97 1755.75 C 4275.51 1755.83 4273.04 1755.93 4270.56 1756.03 C 4269.55 1756.07 4268.55 1756.1 4267.54 1756.14 C 4264.88 1756.25 4262.2 1756.38 4259.52 1756.5 C 4258.69 1756.54 4257.87 1756.57 4257.03 1756.61 C 4253.52 1756.78 4249.99 1756.96 4246.44 1757.16 C 4245.64 1764.53 4244.92 1772.05 4244.25 1779.7 C 4243.76 1785.54 4243.32 1791.17 4242.95 1796.39 C 4250.67 1793.04 4260.15 1791.55 4271.09 1791.55 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2632.28 3551.555 2382.76 903.351" width="2382.76pt" height="903.351pt"><path d=" M 3162.79 3929.04 C 3269.36 3944.53 3390.11 3985.97 3521.69 4052.22 C 3565.67 4074.36 3611.12 4100.9 3656.77 4131.09 C 3657.29 4131.44 3657.78 4131.83 3658.23 4132.27 C 3691.62 4154.86 3725.82 4176.75 3759.91 4197.36 C 3760.05 4197.44 3760.18 4197.53 3760.3 4197.61 C 3806.22 4228.36 3853.41 4257.62 3900.57 4284.58 C 4156.58 4430.99 4336.93 4457.88 4443.15 4454.66 C 4470.32 4453.83 4497.45 4445.17 4519.56 4430.26 C 4541.4 4415.54 4557.52 4395.25 4564.95 4373.14 C 4565.72 4370.87 4633.94 4167.39 4667.17 4069.09 C 4647.13 4077.07 4590.91 4092.88 4484.53 4077.41 C 4377.96 4061.92 4257.21 4020.48 4125.63 3954.23 C 4081.65 3932.09 4036.2 3905.55 3990.55 3875.36 C 3990.03 3875.01 3989.54 3874.62 3989.1 3874.19 C 3955.7 3851.6 3921.5 3829.7 3887.41 3809.09 C 3887.27 3809.01 3887.14 3808.93 3887.02 3808.84 C 3841.09 3778.09 3793.9 3748.83 3746.75 3721.87 C 3490.74 3575.46 3310.4 3548.59 3204.17 3551.8 C 3177 3552.62 3149.87 3561.28 3127.76 3576.19 C 3105.93 3590.92 3089.8 3611.2 3082.37 3633.31 C 3081.6 3635.58 3013.38 3839.06 2980.15 3937.37 C 3000.19 3929.38 3056.41 3913.57 3162.79 3929.04 Z  M 3040.68 4013.15 C 3078.67 4017.38 3126.05 4017.67 3171.86 4017.96 C 3270.32 4018.58 3333.92 4020.2 3355.99 4043.01 C 3361.2 4032.66 3367.27 4020.25 3373.07 4007.67 C 3235.01 3954.2 3137.55 3942.55 3078.87 3942.55 C 3077.78 3942.55 3076.7 3942.55 3075.64 3942.56 C 3060.98 3942.67 3048.25 3943.5 3037.3 3944.72 C 3037.29 3944.72 3037.29 3944.72 3037.28 3944.72 C 3036.88 3944.77 3036.5 3944.82 3036.11 3944.86 C 3016.53 3947.16 3002.81 3950.7 2994.31 3953.5 C 2994.07 3953.58 2993.82 3953.66 2993.58 3953.74 C 2993.41 3953.8 2993.25 3953.85 2993.09 3953.91 C 2992.62 3954.07 2992.16 3954.22 2991.71 3954.38 C 2991.65 3954.41 2991.58 3954.43 2991.51 3954.46 C 2991.18 3954.57 2990.86 3954.69 2990.53 3954.81 C 2990.3 3954.9 2990.06 3954.98 2989.83 3955.07 C 2989.64 3955.14 2989.46 3955.21 2989.27 3955.28 C 2988.96 3955.4 2988.66 3955.51 2988.36 3955.63 C 2988.33 3955.64 2988.3 3955.65 2988.27 3955.67 C 2975.79 3960.55 2971.09 3965.13 2970.25 3966.65 C 2970.23 3966.71 2970.2 3966.76 2970.18 3966.8 C 2970.09 3967.08 2970 3967.29 2969.89 3967.55 C 2964.69 3979.39 2967.09 3985.39 2969.35 3988.88 C 2976.93 4000.57 3000.93 4008.73 3040.68 4013.15 Z  M 4677.14 4039.65 C 4677.14 4039.64 4677.15 4039.63 4677.15 4039.62 C 4677.24 4039.36 4677.32 4039.15 4677.43 4038.9 C 4682.64 4027.06 4680.23 4021.06 4677.97 4017.57 C 4670.39 4005.89 4646.39 3997.72 4606.64 3993.3 C 4568.65 3989.08 4521.27 3988.78 4475.46 3988.49 C 4377 3987.87 4313.4 3986.25 4291.33 3963.44 C 4286.13 3973.8 4280.05 3986.2 4274.25 3998.79 C 4412.31 4052.25 4509.77 4063.9 4568.45 4063.9 C 4569.54 4063.9 4570.62 4063.9 4571.68 4063.89 C 4586.9 4063.78 4600.03 4062.89 4611.25 4061.59 C 4630.69 4059.31 4644.33 4055.8 4652.84 4053.01 C 4653.18 4052.9 4653.53 4052.78 4653.86 4052.67 C 4653.97 4052.64 4654.07 4052.6 4654.17 4052.57 C 4654.68 4052.39 4655.17 4052.22 4655.65 4052.05 C 4655.68 4052.04 4655.71 4052.03 4655.74 4052.02 C 4656.12 4051.89 4656.49 4051.75 4656.85 4051.62 C 4657.05 4051.54 4657.26 4051.47 4657.46 4051.4 C 4657.68 4051.31 4657.89 4051.23 4658.11 4051.15 C 4658.39 4051.04 4658.67 4050.93 4658.95 4050.83 C 4659 4050.81 4659.06 4050.78 4659.12 4050.76 C 4672 4045.71 4676.56 4040.99 4677.14 4039.65 Z  M 3366.78 4005.25 C 3366.73 4005.23 3366.68 4005.21 3366.62 4005.19 C 3365.32 4004.69 3364.03 4004.21 3362.73 4003.72 C 3361.87 4003.39 3361.01 4003.06 3360.15 4002.74 C 3359.16 4002.37 3358.17 4002 3357.19 4001.64 C 3356.03 4001.21 3354.88 4000.77 3353.73 4000.35 C 3352.92 4000.05 3352.12 3999.76 3351.31 3999.46 C 3349.99 3998.98 3348.67 3998.49 3347.36 3998.02 C 3346.67 3997.77 3345.98 3997.52 3345.29 3997.27 C 3343.88 3996.76 3342.46 3996.25 3341.06 3995.75 C 3340.46 3995.53 3339.87 3995.33 3339.27 3995.11 C 3337.78 3994.58 3336.28 3994.05 3334.8 3993.53 C 3334.31 3993.36 3333.83 3993.19 3333.35 3993.02 C 3331.76 3992.47 3330.17 3991.91 3328.59 3991.37 C 3328.2 3991.23 3327.81 3991.1 3327.41 3990.96 C 3325.75 3990.39 3324.09 3989.82 3322.44 3989.26 C 3322.13 3989.16 3321.82 3989.05 3321.51 3988.95 C 3319.78 3988.36 3318.05 3987.78 3316.34 3987.21 C 3316.12 3987.14 3315.9 3987.07 3315.69 3987 C 3313.88 3986.4 3312.08 3985.8 3310.29 3985.22 C 3310.16 3985.17 3310.02 3985.13 3309.88 3985.08 C 3308.01 3984.47 3306.15 3983.87 3304.3 3983.28 C 3304.24 3983.26 3304.18 3983.24 3304.11 3983.22 C 3201.76 3950.41 3126.9 3942.53 3078.56 3942.55 C 3077.58 3942.55 3076.6 3942.56 3075.64 3942.56 C 3074 3942.57 3072.39 3942.6 3070.8 3942.63 C 3070.42 3942.64 3070.04 3942.64 3069.66 3942.65 C 3066.5 3942.72 3063.44 3942.82 3060.48 3942.95 C 3060.13 3942.96 3059.78 3942.98 3059.43 3943 C 3056.48 3943.14 3053.63 3943.3 3050.87 3943.5 C 3050.54 3943.52 3050.21 3943.54 3049.89 3943.57 C 3047.14 3943.77 3044.49 3943.99 3041.93 3944.24 C 3041.63 3944.27 3041.34 3944.3 3041.05 3944.33 C 3039.78 3944.46 3038.53 3944.59 3037.3 3944.72 C 3037.29 3944.72 3037.29 3944.72 3037.28 3944.72 C 3036.88 3944.77 3036.5 3944.82 3036.11 3944.86 C 3016.53 3947.16 3002.81 3950.7 2994.31 3953.5 C 2994.07 3953.58 2993.82 3953.66 2993.58 3953.74 C 2993.41 3953.8 2993.25 3953.85 2993.09 3953.91 C 2992.62 3954.07 2992.16 3954.22 2991.71 3954.38 C 2991.65 3954.41 2991.58 3954.43 2991.51 3954.46 C 2991.18 3954.57 2990.86 3954.69 2990.53 3954.81 C 2990.3 3954.9 2990.06 3954.98 2989.83 3955.07 C 2989.64 3955.14 2989.46 3955.21 2989.27 3955.28 C 2988.96 3955.4 2988.66 3955.51 2988.36 3955.63 C 2988.33 3955.64 2988.3 3955.65 2988.27 3955.67 C 2975.79 3960.55 2971.09 3965.13 2970.25 3966.65 C 2970.23 3966.71 2970.2 3966.76 2970.18 3966.8 C 2970.09 3967.08 2970 3967.29 2969.89 3967.55 C 2964.69 3979.39 2967.09 3985.39 2969.35 3988.88 C 2976.93 4000.57 3000.93 4008.73 3040.68 4013.15 C 3078.67 4017.38 3126.05 4017.67 3171.86 4017.96 C 3270.32 4018.58 3333.92 4020.2 3355.99 4043.01 C 3358.52 4037.97 3361.27 4032.44 3364.08 4026.65 C 3364.43 4025.92 3364.79 4025.19 3365.14 4024.46 C 3365.46 4023.79 3365.79 4023.11 3366.11 4022.44 C 3368.49 4017.46 3370.81 4012.53 3373.05 4007.66 C 3370.95 4006.85 3368.86 4006.04 3366.78 4005.25 Z  M 3343.07 4058.74 C 3340.22 4054.2 3329.08 4045.93 3286.5 4041.68 C 3254.47 4038.48 3214.28 4038.23 3171.74 4037.96 C 3071.36 4037.33 2976.54 4036.74 2952.57 3999.76 C 2945.25 3988.48 2944.86 3975.08 2951.39 3959.94 C 2952.66 3956.21 2954.06 3952.09 2955.57 3947.63 C 2955.76 3947.05 2955.96 3946.47 2956.16 3945.87 C 2956.16 3945.87 2956.16 3945.87 2956.17 3945.86 C 2956.51 3944.85 2956.86 3943.82 2957.21 3942.78 C 2957.22 3942.74 2957.23 3942.71 2957.24 3942.68 C 2977.26 3883.56 3014.61 3772.35 3039.25 3698.94 C 3008.46 3688.33 2910.42 3652.64 2861.3 3612.39 C 2858.39 3610.01 2856.23 3608.6 2854.72 3607.78 C 2854.29 3617.34 2860.32 3644 2879.79 3683.29 C 2902.48 3729.06 2933.13 3771.46 2963.88 3799.63 C 2965.98 3801.55 2967.16 3804.27 2967.13 3807.11 C 2967.1 3809.96 2965.86 3812.65 2963.72 3814.53 C 2944.98 3830.92 2903.45 3854.12 2811.95 3871.6 C 2756.56 3882.18 2690.05 3888.94 2632.28 3889.93 C 2642.43 3897.34 2663.77 3910.52 2708.28 3931.98 C 2761.17 3957.46 2827.69 3985.38 2895.59 4010.58 C 3068.71 4074.84 3210.81 4107.65 3285.44 4100.56 C 3317.22 4097.55 3336.15 4087.6 3341.69 4070.97 C 3341.71 4070.94 3341.72 4070.9 3341.73 4070.87 C 3341.77 4070.76 3341.81 4070.66 3341.85 4070.55 C 3341.93 4070.36 3342 4070.17 3342.09 4069.99 C 3342.11 4069.94 3342.13 4069.88 3342.15 4069.83 C 3345.55 4062.7 3343.75 4059.82 3343.07 4058.74 Z  M 4683.6 4191.93 C 4702.34 4175.54 4743.88 4152.33 4835.37 4134.85 C 4890.76 4124.27 4957.27 4117.51 5015.04 4116.52 C 5004.89 4109.11 4983.55 4095.93 4939.04 4074.48 C 4886.15 4048.99 4819.63 4021.08 4751.73 3995.87 C 4578.61 3931.62 4436.51 3898.81 4361.88 3905.89 C 4330.1 3908.9 4311.17 3918.86 4305.63 3935.48 C 4305.62 3935.51 4305.6 3935.55 4305.59 3935.58 C 4305.55 3935.69 4305.51 3935.8 4305.46 3935.91 C 4305.39 3936.09 4305.32 3936.28 4305.23 3936.46 C 4305.21 3936.52 4305.19 3936.57 4305.17 3936.62 C 4301.77 3943.75 4303.57 3946.63 4304.25 3947.71 C 4307.1 3952.26 4318.24 3960.52 4360.82 3964.77 C 4392.85 3967.97 4433.04 3968.22 4475.58 3968.49 C 4575.96 3969.12 4670.78 3969.72 4694.75 4006.69 C 4702.07 4017.98 4702.46 4031.37 4695.93 4046.51 C 4694.38 4051.09 4692.62 4056.26 4690.7 4061.93 C 4670.86 4120.54 4632.97 4233.33 4608.07 4307.51 C 4638.86 4318.12 4736.9 4353.81 4786.02 4394.06 C 4788.93 4396.44 4791.09 4397.85 4792.6 4398.68 C 4793.03 4389.11 4787 4362.46 4767.53 4323.16 C 4744.84 4277.4 4714.19 4234.99 4683.44 4206.83 C 4681.34 4204.91 4680.16 4202.18 4680.19 4199.34 C 4680.22 4196.5 4681.46 4193.8 4683.6 4191.93 Z  M 4571.68 4063.89 C 4573.39 4063.88 4575.05 4063.85 4576.71 4063.82 C 4577.07 4063.81 4577.44 4063.81 4577.8 4063.8 C 4579.42 4063.76 4581.03 4063.72 4582.6 4063.67 C 4582.74 4063.67 4582.87 4063.66 4583.01 4063.65 C 4584.52 4063.6 4586.01 4063.54 4587.48 4063.47 C 4587.72 4063.46 4587.97 4063.45 4588.21 4063.44 C 4589.78 4063.37 4591.33 4063.28 4592.85 4063.19 C 4592.96 4063.18 4593.08 4063.18 4593.2 4063.17 C 4594.73 4063.08 4596.23 4062.97 4597.7 4062.87 C 4597.75 4062.86 4597.81 4062.86 4597.86 4062.86 C 4599.41 4062.74 4600.92 4062.62 4602.41 4062.49 C 4602.46 4062.48 4602.51 4062.48 4602.56 4062.47 C 4605.58 4062.21 4608.47 4061.91 4611.25 4061.59 C 4630.69 4059.31 4644.33 4055.8 4652.84 4053.01 C 4653.18 4052.9 4653.53 4052.78 4653.86 4052.67 C 4653.97 4052.64 4654.07 4052.6 4654.17 4052.57 C 4654.68 4052.39 4655.17 4052.22 4655.65 4052.05 C 4655.68 4052.04 4655.71 4052.03 4655.74 4052.02 C 4656.12 4051.89 4656.49 4051.75 4656.85 4051.62 C 4657.05 4051.54 4657.26 4051.47 4657.46 4051.4 C 4657.68 4051.31 4657.89 4051.23 4658.11 4051.15 C 4658.39 4051.04 4658.67 4050.93 4658.95 4050.83 C 4659 4050.81 4659.06 4050.78 4659.12 4050.76 C 4672 4045.71 4676.56 4040.99 4677.14 4039.65 C 4677.14 4039.64 4677.15 4039.63 4677.15 4039.62 C 4677.24 4039.36 4677.32 4039.15 4677.43 4038.9 C 4682.64 4027.06 4680.23 4021.06 4677.97 4017.57 C 4670.39 4005.89 4646.39 3997.72 4606.64 3993.3 C 4568.65 3989.08 4521.27 3988.78 4475.46 3988.49 C 4377 3987.87 4313.4 3986.25 4291.33 3963.44 C 4288.79 3968.51 4286.03 3974.06 4283.21 3979.88 C 4282.9 3980.51 4282.6 3981.14 4282.29 3981.77 C 4281.93 3982.52 4281.57 3983.28 4281.2 3984.04 C 4278.82 3989.01 4276.51 3993.93 4274.27 3998.79 C 4276.17 3999.53 4278.05 4000.25 4279.92 4000.97 C 4280.18 4001.06 4280.45 4001.17 4280.71 4001.27 C 4281.9 4001.72 4283.08 4002.17 4284.27 4002.61 C 4285.24 4002.98 4286.21 4003.35 4287.18 4003.72 C 4288.09 4004.06 4288.98 4004.39 4289.88 4004.72 C 4291.13 4005.19 4292.37 4005.65 4293.61 4006.11 C 4294.34 4006.38 4295.07 4006.64 4295.8 4006.91 C 4297.19 4007.42 4298.59 4007.94 4299.97 4008.44 C 4300.61 4008.67 4301.23 4008.89 4301.87 4009.12 C 4303.34 4009.66 4304.81 4010.19 4306.28 4010.71 C 4306.82 4010.91 4307.37 4011.1 4307.91 4011.29 C 4309.46 4011.84 4311.01 4012.39 4312.54 4012.93 C 4312.98 4013.08 4313.41 4013.23 4313.85 4013.39 C 4315.48 4013.96 4317.12 4014.53 4318.74 4015.09 C 4319.11 4015.22 4319.47 4015.34 4319.84 4015.47 C 4321.53 4016.05 4323.21 4016.62 4324.88 4017.19 C 4325.19 4017.29 4325.49 4017.39 4325.8 4017.5 C 4327.53 4018.09 4329.26 4018.67 4330.99 4019.24 C 4331.2 4019.31 4331.4 4019.38 4331.62 4019.45 C 4333.42 4020.05 4335.23 4020.65 4337.02 4021.23 C 4337.17 4021.28 4337.31 4021.33 4337.45 4021.37 C 4339.31 4021.98 4341.17 4022.58 4343.01 4023.17 C 4343.08 4023.2 4343.15 4023.22 4343.22 4023.24 C 4445.59 4056.06 4520.45 4063.92 4568.81 4063.9 C 4569.78 4063.9 4570.74 4063.9 4571.68 4063.89 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="2626.64 10 2394.04 812.239" width="2394.04pt" height="812.239pt"><path d=" M 4809.57 361.51 C 4829.51 312.867 4811.39 258.149 4765.5 228.455 C 4747.31 216.684 4646.93 155.091 4456.71 98.402 C 4367.85 71.921 4273.84 51.031 4177.3 36.316 C 4062.74 18.854 3943.76 10 3823.66 10 C 3703.56 10 3584.58 18.854 3470.02 36.316 C 3373.48 51.031 3279.47 71.921 3190.61 98.402 C 3000.39 155.092 2900.01 216.684 2881.82 228.455 C 2835.93 258.149 2817.81 312.866 2837.76 361.519 C 2838.77 363.98 2931.16 588.726 2972.58 690.214 C 2973.29 689.076 2974.05 687.916 2974.84 686.732 C 3004.06 643.33 3081.61 577.346 3211.66 522.314 C 3286.84 490.502 3372.09 465.438 3465.04 447.817 C 3574.32 427.103 3694.98 416.6 3823.66 416.6 C 3952.34 416.6 4073 427.103 4182.28 447.817 C 4275.23 465.438 4360.48 490.502 4435.66 522.314 C 4565.71 577.346 4643.26 643.33 4672.48 686.732 C 4673.27 687.916 4674.03 689.076 4674.75 690.214 C 4716.16 588.726 4808.55 363.979 4809.57 361.51 Z  M 3102.89 574.809 C 3080.34 588.29 3062.02 602.016 3047.2 615.047 C 3077.87 591.674 3116.95 567.13 3164.73 543.705 C 3142.65 553.012 3122.02 563.381 3102.89 574.809 Z  M 3103.06 600.755 C 3056.7 629.937 3028.08 655.94 3012.22 672.614 C 2988.06 698.029 2983.02 712.498 2982.87 715.555 C 2982.88 715.576 2982.88 715.598 2982.89 715.619 C 2982.9 715.638 2982.9 715.657 2982.91 715.676 C 2986.39 726.827 2992.3 733.877 3000.99 737.228 C 3005.54 738.982 3010.77 739.797 3016.58 739.797 C 3058.41 739.803 3130.22 697.49 3194.51 659.614 C 3267.07 616.869 3330.3 579.622 3367.24 587.493 C 3359.96 560.389 3349.63 522.451 3342.27 497.466 C 3315 505.377 3288.58 514.04 3263.05 523.48 C 3203.16 545.626 3149.33 571.625 3103.06 600.755 Z  M 4290.79 586.434 C 4328.6 586.434 4386.85 620.755 4452.81 659.614 C 4526.02 702.745 4608.99 751.625 4646.33 737.228 C 4655.02 733.877 4660.93 726.827 4664.41 715.676 C 4664.42 715.657 4664.42 715.638 4664.43 715.619 C 4664.44 715.598 4664.44 715.576 4664.45 715.555 C 4664.3 712.498 4659.26 698.029 4635.1 672.614 C 4619.25 655.94 4590.62 629.937 4544.26 600.755 C 4497.99 571.625 4444.16 545.626 4384.27 523.48 C 4358.74 514.04 4332.32 505.377 4305.06 497.466 C 4297.69 522.451 4287.36 560.389 4280.08 587.493 C 4283.44 586.777 4287.01 586.434 4290.79 586.434 Z  M 2626.64 456.516 C 2634.28 465.818 2657.12 485.351 2702.38 510.555 C 2755.17 539.95 2812.41 562.219 2859.41 571.651 C 2864.72 572.717 2868.21 577.813 2867.3 583.148 C 2863.11 607.552 2844.32 649.778 2778.58 712.357 C 2738.92 750.121 2686.98 790.164 2638.37 820.569 C 2651.3 822.278 2678.92 823.594 2736.56 819.697 C 2801.43 815.312 2880.04 805.925 2957.9 793.265 C 3157.26 760.85 3302.51 716.123 3356.41 670.551 C 3386.23 645.342 3378.84 627.451 3376.41 621.572 C 3376.4 621.544 3376.39 621.515 3376.38 621.487 C 3376.34 621.392 3376.31 621.294 3376.28 621.197 C 3376.2 620.994 3376.13 620.789 3376.07 620.581 C 3376.06 620.533 3376.04 620.488 3376.02 620.44 C 3373.63 611.864 3369.31 609.241 3366.27 608.013 C 3339.69 597.297 3267.95 639.558 3204.66 676.846 C 3165.5 699.922 3124.99 723.783 3088.93 739.855 C 3058.99 753.202 3035.28 759.752 3016.35 759.753 C 3007.93 759.753 3000.46 758.457 2993.79 755.888 C 2979.37 750.324 2969.33 738.946 2963.96 722.07 C 2941.39 666.547 2884.94 529.01 2849.59 442.934 C 2818.75 448.736 2706.11 468.17 2633.84 457.266 C 2630.81 456.809 2628.46 456.594 2626.64 456.516 Z  M 3012.22 672.614 C 2988.06 698.029 2983.02 712.498 2982.87 715.555 C 2982.88 715.576 2982.88 715.598 2982.89 715.619 C 2982.9 715.638 2982.9 715.657 2982.91 715.676 C 2986.39 726.827 2992.3 733.877 3000.99 737.228 C 3005.54 738.982 3010.77 739.797 3016.58 739.797 C 3058.41 739.803 3130.22 697.49 3194.51 659.614 C 3267.07 616.869 3330.3 579.622 3367.24 587.493 C 3364.01 575.446 3360.17 561.259 3356.26 547.019 C 3248.71 562.641 3159.19 587.676 3090.08 621.476 C 3056.68 637.809 3033.57 653.631 3017.79 666.917 C 3015.78 668.919 3013.93 670.821 3012.22 672.614 Z  M 4653.53 755.888 C 4646.87 758.457 4639.39 759.753 4630.97 759.753 C 4612.04 759.753 4588.34 753.203 4558.39 739.855 C 4522.33 723.783 4481.83 699.922 4442.66 676.846 C 4379.37 639.558 4307.62 597.298 4281.05 608.013 C 4278.01 609.241 4273.69 611.864 4271.3 620.44 C 4271.28 620.488 4271.26 620.533 4271.25 620.581 C 4271.19 620.789 4271.12 620.994 4271.04 621.198 C 4271.01 621.294 4270.98 621.392 4270.94 621.487 C 4270.93 621.515 4270.92 621.544 4270.91 621.572 C 4268.48 627.451 4261.09 645.342 4290.91 670.551 C 4344.81 716.123 4490.06 760.85 4689.42 793.265 C 4767.28 805.925 4845.89 815.312 4910.76 819.697 C 4968.39 823.593 4996.02 822.277 5008.95 820.569 C 4960.34 790.165 4908.4 750.121 4868.74 712.357 C 4832.46 677.816 4787.61 627.362 4780.02 583.148 C 4779.11 577.813 4782.6 572.717 4787.91 571.651 C 4834.91 562.219 4892.15 539.95 4944.94 510.555 C 4990.2 485.351 5013.04 465.818 5020.68 456.516 C 5018.86 456.594 5016.51 456.809 5013.48 457.266 C 4998.13 459.582 4980.95 460.529 4963.13 460.53 C 4897.04 460.531 4822.02 447.504 4797.73 442.934 C 4795.26 448.956 4792.66 455.276 4789.97 461.829 C 4754.59 547.977 4704.33 670.477 4683.36 722.083 C 4677.98 738.951 4667.95 750.326 4653.53 755.888 Z " fill="rgb(255,255,255)"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="47" height="44" fill="none" viewBox="0 0 47 44"><path fill="#fff" d="M40.1 14.6c-1-.1-2.3-2.2-1.2-3.9.7-1.1 1.4-2.1.3-3.9-.8-1.4-1.7-1.2-2.7-.9-1.6.5-2.2-1.8-2.2-3.7 0-1-.5-1.9-2.3-1.9-1 0-1.5.8-2 1.7-.8 1.3-3.6 1.7-4.1.3-.5-1.4-3-1.5-4.7-.4-1.6 1.1-3.5.7-3.6.4-.2-.2-.3-.4-.4-.4-.1 0-.5-.9-1.5-1.2-.5-.2-1.1-.1-1.9.2-3 1.2-1.7 4-2.7 6.1-1.4 2.7-2.9-.3-5.5.4-1.9.5-3.3 2.8-3.3 5.2.1 2.2 3 4.7 2.7 6.3-.3 1.3-3.4-.6-4.6 3.2-.4 1.2-.2 2.3.1 3.7.6 2.9 2.1 1.7 3.3 2.9 1.4 1.5 1.6 3.1.2 4.9-2.8 3.9.5 6.7 4.3 6.1 2.1-.3 5.5-1.1 4.9.4-.3 1-1.1 2-.6 2.7 2.7 3 4.8-2 7.5-1.8h.3c.1 0 .4.2.7.4.2.2.5.3.6.4.1.1.4 1.1 1.3 1.6.5.3 1.1.5 1.8.5 1.4 0 3.5-.6 4.4-2 .3-.4.3-1.1.3-1.7.1-1 2.1-.2 4.2.1 2.9.4 5.6-1.4 4.3-5.6-.1-.3-.2-.5-.4-.7-.3-.4-.4-1 0-1.4.2-.2.5-.3.9-.2 3.9.8 6.7-.5 5.5-4-.6-1.8-4.5-2.6-1.5-3.6 1.1-.4 2.3-.8 3-2.3 1.7-3.4.5-8.6-3.8-8-.3.1-.9.2-1.6.1Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="63" height="58" fill="none" viewBox="0 0 63 58"><path fill="#fff" d="M17.3 24.6C29.8 27.8 12 9.2 12 9.2l11.4 9.1c5.7 4.7 4.9 2.5 4.5-3L26.4 3l4.8 12.1c1.3 3.3 3.7 3.7 5-1L41.7.8l-1.5 14.6c-.6 5 .8 3.6 5.6-.9L58.9 3.1 48 16.7c-3.2 4.4-5.5 6.7-1.3 7.1l15.1-.7-13 3.2c-7.4 2.7-2.1 4.3 4.8 7l8.7 3.9-11-2.2c-8.2-2.3-10.4-.8-4.6 5.8l10.1 11.4-11.5-8.8c-2.5-2.3-6.8-4.2-6.6-.3l1.3 14L35.7 43c-1-3.7-2.1-3.8-4 2l-3.8 11.4.8-10.3c.2-6.4-.7-6.7-4.8-3.3L12 51.9l8.8-11.3c2.7-3.2 3.8-5.5.2-5.7L6.3 37.3l10.1-4.2c3.3-1.5 7.5-2.6-.3-5.6L.6 21l16.7 3.6Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="55" height="58" fill="none" viewBox="0 0 55 58"><path fill="#fff" d="M19.9 20.1C21.1 18.9 16.4.7 16.4.7l5.3 11.7c3.5 7.1 5.9 6 7.7.9l3.7-9.7-.8 9.8c-.3 3.9.8 6.3 5.6 1.1L46.7 6l-7 10.6c-1.6 2.9-4.5 7.5 5 5.6l10.1-1.3-9 4.3c-5.5 1.6-7.1 4.1-1.8 6.1l9.5 4.9-10.7-1.4c-5.1-.9-2.1 1.7 3.8 8l7.3 7.9-10.3-7.6c-7.5-6.3-11.1-6.7-6.9 3.1l3 10.6-5.3-9c-2.8-4.7-5.2-10.4-7.3-1.2L24 58l1-15.3c.4-3.9-1.8-3.8-4.4-1l-8.9 8 5.9-9c4.3-6.5-.3-5.8-7-4.8L.3 37.1 9 33.8c7.6-2.5 7.8-3.8 4.2-5.8L2.9 23.9l7.7.7c3.9.3 8.5 1 1.7-5.8L1.1 7.7S18 22 19.9 20.1Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="61" height="62" fill="none" viewBox="0 0 61 62"><path fill="#fff" d="M41.9 30.5c.8-.2 18.5-3.6 18.5-3.6s-13.1.7-18.1.2c.6-.3 18.1-7.6 18.1-7.6L50.7 22c-7.7 2.1-8.8 2.2-8.8 2.2L58.4 9.5 39 22.2l13.8-18-16.2 16.6 6.1-17.5-8.5 15.9L35 .9s-2.2 10.4-3.8 19.9c0-1.9-4.8-19.9-4.8-19.9s1.6 12.9 2.3 20.2c-.2-.3-8.4-16.6-8.4-16.6s5.8 16.8 6 17.5c-1-1.1-11.6-14.4-11.6-14.4s8.8 15.8 9 16.5C23.5 24 9.6 11.9 9.6 11.9s12.8 14.5 12.6 14.4L4.3 16.4l16.1 11.5L.3 25.5s10.1 2.7 20.3 4.6L.3 33.3s17.4-.2 19.9.4c-1.3 1.4-18.1 9.2-18.1 9.2l18.6-6.6L2.2 54.2 23.7 39 9 59.8l17.9-18.7c-.2 5.7-2 20.9-2 20.9l5.5-20.4 2.9 18.3s-.5-17.8-.1-18.6c3.9 7.5 9.8 18.6 9.8 18.6l-6.9-20 12.6 13.9S38.9 39 38.6 38.3l15.5 10.3-8-8.2c-1.4-1.2-4.1-3.2-4.6-3.9L60 45 42.1 34l17.5.4-17.7-3.9Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="63" height="59" fill="none" viewBox="0 0 63 59"><path fill="#fff" d="M29.8 46c-.9-1.6-3-2.1-4.5-1.1L17.1 54l3.7-11.4c-.1-1.8-1.7-3.2-3.5-3.2l-5 .2 2.3-4.4c.8-1.6.2-3.7-1.4-4.6L.1 28.1l13.1-2.4c1.6-.9 2.2-3 1.4-4.6l-2.3-4.4 5 .2c1.8.1 3.4-1.3 3.5-3.2L17.5.4l7.8 10.9c1.6 1 3.6.5 4.5-1.1l2.6-4.3 2.6 4.3c.9 1.6 3 2.1 4.5 1.1L47 2.6l-3 11.1c.1 1.8 1.7 3.2 3.5 3.2l5-.2-2.3 4.4c-.8 1.6-.2 3.7 1.4 4.6l10.9 2.5-10.9 2.4c-1.6.9-2.2 3-1.4 4.6l2.3 4.4-5-.2c-1.8-.1-3.4 1.3-3.5 3.2l5.6 15.9L39.5 45c-1.6-1-3.6-.5-4.5 1.1l-2.6 4.3-2.6-4.4Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="70" height="55" fill="none" viewBox="0 0 70 55"><path fill="#fff" d="M48.8 24.9c8.4-6.4 12.8-9.4 20.9-14.9-10 3.9-19.2 6.1-25.7 7.8.7-6.7 1.1-13.3 1.7-17.7-2 3-8.5 15.9-10.4 17.5-3.8-3.3-5.7-5.5-8.3-8 .6 3.5.2 7 .3 12-7.3-.9-15.7-2.1-26.4-3.7 9.2 3.6 15.7 7.4 23.2 10.7-3.5 3.5-5.6 6.4-12.6 12.4 5.8-1.7 9.3-2.5 17.6-5.1.1 4.7.7 12.3.6 19 2-3 5.5-13.4 7.7-17.6 3.7 3.4 5.5 4.6 9 8.4-.6-3.5-1.8-6.9-2.7-11.7 1.2-.1 7 .4 25.8 2.7-9.7-5.3-12.9-7.9-20.7-11.8Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="61" height="36" fill="none" viewBox="0 0 61 36"><path fill="#fff" d="M30.4 35.5C13.8 35.5.3 27.8.3 18.2.3 8.6 13.8.9 30.4.8 47 .8 60.5 8.5 60.5 18.1c-.1 9.6-13.5 17.3-30.1 17.4Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="67" height="42" fill="none" viewBox="0 0 67 42"><path fill="#fff" d="m33.3 41.3-1.9-6.2-2.4 6.1-1.4-6.4-2.8 5.9-.9-6.5-3.3 5.6-.3-6.5-3.9 5.3.4-6.5-4.4 4.8 1.1-6.4-5 4.2 2.1-6.1L5 31.8l3.2-5.6L2 28.1l4.6-4.5-6.5-.2L6 20.8.1 18.2l6.5-.2L2 13.5l6.2 1.8L5 9.7l5.6 3.3-2.1-6.2 5 4.2-1.1-6.4 4.4 4.8-.4-6.5 3.8 5.3.4-6.5 3.3 5.6.9-6.4 2.8 5.8L29 .4l2.4 6L33.3.2l1.9 6.2 2.3-6 1.4 6.3L41.8.8l.9 6.5L46 1.7l.3 6.5 3.8-5.3-.3 6.5 4.4-4.8-1.1 6.4L58 6.8 56 13l5.6-3.3-3.2 5.6 6.2-1.9L60 18l6.4.1-5.9 2.6 5.9 2.6-6.4.2 4.6 4.5-6.2-1.8 3.2 5.6-5.6-3.3 2 6.2-4.9-4.2 1.1 6.4-4.4-4.8.3 6.5-3.8-5.3-.3 6.5-3.3-5.6-.9 6.5-2.8-5.9-1.4 6.4-2.4-6.1-1.9 6.2Z"></path></svg>
                                                </div>
                                                <div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="58" height="47" fill="none" viewBox="0 0 58 47">
                                                    <path fill="#fff" d="M16.6 7.9c-3.3-6 7.4-9.1 13.7-4.5 9.8-7 21.1 1.6 16.1 8.2C55.9 8 62.2 23 51.2 25.3c3.9 14.6-9 13-13.3 9.7 6.3 7.5-6 12.4-12.1 8-5.8 5.6-21.6 3.5-17-5C.4 39.9-4.8 22.9 7.5 20.7c-6.2-6-3.6-13.6 9.1-12.8Z"></path></svg></div><div class="shape" data-id="customShape" title="Custom Shape"><svg xmlns="http://www.w3.org/2000/svg" width="51" height="42" fill="none" viewBox="0 0 51 42"><path fill="#fff" d="M50.1 31.9c0 .5-3.1.5-3.3 1-.2.5 2.3 2.4 2 2.8-.3.4-2.9-1.3-3.3-.9-.4.3.7 3.3.2 3.5-3.2 1.1-7.2-1-10.5-.4s-6.4 3.9-9.7 3.9c-3.3 0-6.4-3.4-9.7-3.9-3.3-.6-7.3 1.6-10.5.4-.5-.2.6-3.1.2-3.5-.4-.3-3 1.3-3.3.9-.3-.4 2.2-2.3 2-2.8-.2-.5-3.3-.5-3.3-1 0-1.8 3.1-3.5 3.1-5.3C4 24.8.9 23.1.9 21.3.9 19.5 4 17.8 4 16 4 14.2.9 12.5.9 10.7c0-.5 3.1-.5 3.3-1 .2-.5-2.3-2.4-2-2.8.3-.4 2.9 1.3 3.3.9.4-.3-.7-3.3-.2-3.5 3.2-1.1 7.2 1 10.5.4S22.2.8 25.5.8c3.3 0 6.4 3.4 9.7 3.9 3.3.6 7.3-1.6 10.5-.4.5.2-.6 3.1-.2 3.5.4.3 3-1.3 3.3-.9.3.4-2.2 2.3-2 2.8.2.5 3.3.5 3.3 1 0 1.8-3.1 3.5-3.1 5.3 0 1.8 3.1 3.5 3.1 5.3 0 1.8-3.1 3.5-3.1 5.3 0 1.8 3.1 3.6 3.1 5.3Z"></path>
                                                    </svg>
                                                </div>
                                               
                       */ }
                                            </div >

                                        </div >

                                    </div >
                                </div>


                            </div >
                        </div >

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


                        <div>
                            <button onClick={createEmptyCanvas}>New Canvas</button>
                        </div>


                        {!file ? (
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
                                </div>
                                <input type="file" id="dropzone-file" accept="image/*" onChange={(e) => setFileData(e)} multiple={false} className="hidden" />
                            </label>
                        ) : (
                            <>
                                <div className='relative'>
                                    <div className='absolute -right-12'>
                                        <div className="opacity-60">
                                            <button className={modalHeaderButtonClasses} onClick={() => setFile(null)} data-testid="save-button">
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
                        )}
                    </div>


                </div >

            </div >
        </main >
    );
}

export default ImageEditor;