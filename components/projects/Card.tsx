import React, { useState } from "react";
import Link from "next/link";
import CardStatus from "./CardStatus";

const Card = (props) => {
    const project = props.project;
    const id = props.userId;
    const projectId = project.id;
    const link = project.link;
    const subdomain = project.subdomain;
    const isOnline = project.isOnline;
    // const [isLoading, setIsLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [framework, setFramework] = useState(props?.project.framework)

    return (
        <div className="relative">
            <div className={`card max-w-xl bg-base-300 shadow-xl m-4`}>
                {isOnline && <span className="relative flex h-3 w-3 ml-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>}
                {framework === 'next\n' && <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_6_50)">
                        <path d="M38.2812 0H11.7188C5.24666 0 0 5.24666 0 11.7188V38.2812C0 44.7533 5.24666 50 11.7188 50H38.2812C44.7533 50 50 44.7533 50 38.2812V11.7188C50 5.24666 44.7533 0 38.2812 0Z" fill="#242938" />
                        <path d="M23.7209 5.4793C23.6369 5.48691 23.3695 5.51367 23.1289 5.53262C17.5809 6.03281 12.384 9.02656 9.09239 13.6277C7.25977 16.1861 6.08731 19.0881 5.64453 22.1621C5.48809 23.2352 5.46895 23.5521 5.46895 25.0068C5.46895 26.4617 5.48809 26.7787 5.64473 27.8516C6.70606 35.1867 11.926 41.3498 19.0053 43.6332C20.273 44.0418 21.6094 44.3205 23.1291 44.4885C23.7211 44.5533 26.2793 44.5533 26.8713 44.4885C29.4945 44.1982 31.7168 43.5492 33.9086 42.4303C34.2445 42.2586 34.3096 42.2127 34.2637 42.1746C34.2332 42.1516 32.8012 40.2309 31.083 37.9094L27.9596 33.69L24.0455 27.8975C21.892 24.7129 20.1203 22.1086 20.1049 22.1086C20.0897 22.1049 20.0744 24.6785 20.0668 27.8211C20.0553 33.3234 20.0516 33.5449 19.9828 33.6746C19.8836 33.8617 19.8072 33.9381 19.6467 34.0223C19.5246 34.0832 19.4176 34.0947 18.841 34.0947H18.1805L18.0047 33.984C17.8959 33.9158 17.8075 33.8195 17.7488 33.7053L17.6688 33.5334L17.6766 25.8775L17.6879 18.2178L17.8063 18.0687C17.8674 17.9887 17.9973 17.8855 18.0889 17.8359C18.2453 17.7596 18.3064 17.752 18.967 17.752C19.7461 17.752 19.8758 17.7824 20.0783 18.0039C20.1356 18.065 22.2547 21.2572 24.7902 25.1023C27.3572 28.9943 29.9257 32.8853 32.4957 36.7752L35.5887 41.4605L35.7453 41.3574C37.1313 40.4562 38.5977 39.1732 39.7584 37.8367C42.2289 34.9996 43.8213 31.5402 44.3559 27.8516C44.5123 26.7787 44.5314 26.4617 44.5314 25.0068C44.5314 23.5521 44.5123 23.2352 44.3559 22.1621C43.2943 14.827 38.0744 8.66406 30.9951 6.38066C29.7465 5.97578 28.4178 5.69707 26.9285 5.5291C26.5619 5.49082 24.0379 5.44902 23.7211 5.47949L23.7209 5.4793ZM31.7166 17.2936C31.8998 17.3852 32.0488 17.5607 32.1023 17.7439C32.1328 17.8434 32.1404 19.9664 32.1328 24.7508L32.1213 31.6164L30.9109 29.7605L29.6967 27.9049V22.9143C29.6967 19.6877 29.7119 17.8738 29.7348 17.7859C29.7959 17.5723 29.9295 17.4043 30.1129 17.3049C30.2693 17.2248 30.3268 17.217 30.9262 17.217C31.4914 17.217 31.5906 17.2248 31.7166 17.2936Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_6_50">
                            <rect width="50" height="50" fill="white" />
                        </clipPath>
                    </defs>
                </svg>}

                {framework === 'remix\n' && <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_6_43)">
                        <path d="M38.2812 0H11.7188C5.24666 0 0 5.24666 0 11.7188V38.2812C0 44.7533 5.24666 50 11.7188 50H38.2812C44.7533 50 50 44.7533 50 38.2812V11.7188C50 5.24666 44.7533 0 38.2812 0Z" fill="#242938" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M36.6998 32.9543C36.9656 36.3699 36.9656 37.9711 36.9656 39.7188H29.0629C29.0629 39.3381 29.0697 38.9898 29.0766 38.6367C29.098 37.5389 29.1203 36.3941 28.9424 34.0824C28.7074 30.6979 27.25 29.9459 24.5701 29.9459H12.1406V23.7881H24.9463C28.3313 23.7881 30.0238 22.7584 30.0238 20.032C30.0238 17.6346 28.3313 16.1818 24.9463 16.1818H12.1406V10.1562H26.3566C34.0199 10.1562 37.8281 13.7758 37.8281 19.5574C37.8281 23.882 35.1484 26.7023 31.5281 27.1725C34.5842 27.7836 36.3707 29.5229 36.6998 32.9543V32.9543Z" fill="white" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M36.6998 32.9543C36.9656 36.3699 36.9656 37.9711 36.9656 39.7188H29.0629C29.0629 39.3381 29.0697 38.9898 29.0766 38.6367C29.098 37.5389 29.1203 36.3941 28.9424 34.0824C28.7074 30.6979 27.25 29.9459 24.5701 29.9459H12.1406V23.7881H24.9463C28.3313 23.7881 30.0238 22.7584 30.0238 20.032C30.0238 17.6346 28.3313 16.1818 24.9463 16.1818H12.1406V10.1562H26.3566C34.0199 10.1562 37.8281 13.7758 37.8281 19.5574C37.8281 23.882 35.1484 26.7023 31.5281 27.1725C34.5842 27.7836 36.3707 29.5229 36.6998 32.9543V32.9543Z" fill="white" />
                        <path d="M12.1406 39.7188V35.1283H20.4967C21.8924 35.1283 22.1955 36.1635 22.1955 36.7809V39.7188H12.1406Z" fill="white" />
                        <path d="M12.1094 39.7188V39.75H22.2268V36.7809C22.2268 36.468 22.1502 36.0475 21.8945 35.7043C21.6379 35.3596 21.2033 35.0971 20.4967 35.0971H12.1094V39.7188Z" stroke="white" stroke-opacity="0.8" stroke-width="0.32" />
                    </g>
                    <defs>
                        <clipPath id="clip0_6_43">
                            <rect width="50" height="50" fill="white" />
                        </clipPath>
                    </defs>
                </svg>}

                {framework === 'vite\n' && <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38.2812 0H11.7188C5.24666 0 0 5.24666 0 11.7188V38.2812C0 44.7533 5.24666 50 11.7188 50H38.2812C44.7533 50 50 44.7533 50 38.2812V11.7188C50 5.24666 44.7533 0 38.2812 0Z" fill="#242938" />
                    <path d="M39.9015 13.4755L25.7039 41.1032C25.6373 41.2331 25.5401 41.3414 25.4223 41.417C25.3045 41.4926 25.1703 41.5328 25.0336 41.5334C24.8968 41.534 24.7624 41.495 24.644 41.4204C24.5257 41.3459 24.4276 41.2384 24.36 41.1091L9.88154 13.4779C9.80874 13.3392 9.7738 13.1809 9.7808 13.0214C9.7878 12.8619 9.83646 12.7079 9.92107 12.5774C10.0057 12.447 10.1227 12.3455 10.2585 12.2849C10.3942 12.2243 10.543 12.207 10.6875 12.2352L24.9002 15.0003C24.9906 15.0181 25.0831 15.0181 25.1735 15.0003L39.0891 12.2399C39.233 12.2113 39.3814 12.2278 39.517 12.2875C39.6525 12.3471 39.7697 12.4475 39.8549 12.5769C39.94 12.7063 39.9896 12.8594 39.9979 13.0183C40.0062 13.1772 39.9727 13.3365 39.9015 13.4755Z" fill="url(#paint0_linear_6_57)" />
                    <path d="M31.6695 8.60954L21.1644 10.8491C21.0803 10.867 21.0041 10.9149 20.9478 10.9851C20.8914 11.0554 20.8582 11.144 20.8533 11.2371L20.2073 23.1158C20.2037 23.181 20.2141 23.2462 20.2378 23.3062C20.2614 23.3662 20.2976 23.4193 20.3434 23.4615C20.3893 23.5036 20.4435 23.5335 20.5018 23.5488C20.5601 23.5641 20.6209 23.5644 20.6794 23.5496L23.6038 22.8149C23.6668 22.799 23.7324 22.8007 23.7947 22.8197C23.857 22.8387 23.9139 22.8744 23.9601 22.9235C24.0064 22.9727 24.0405 23.0337 24.0594 23.101C24.0783 23.1683 24.0814 23.2397 24.0683 23.3086L23.1998 27.9395C23.1864 28.0108 23.1902 28.0846 23.211 28.1538C23.2317 28.223 23.2686 28.2851 23.3181 28.3341C23.3675 28.3831 23.4279 28.4172 23.4931 28.4331C23.5583 28.4491 23.6263 28.4463 23.6902 28.425L25.4965 27.8278C25.5606 27.8065 25.6286 27.8037 25.694 27.8197C25.7593 27.8357 25.8197 27.8699 25.8692 27.919C25.9187 27.9681 25.9556 28.0304 25.9763 28.0998C25.9969 28.1691 26.0006 28.2432 25.987 28.3145L24.6053 35.5882C24.5188 36.0432 25.0752 36.2913 25.3075 35.9021L25.4619 35.6411L34.0235 17.0483C34.0556 16.9783 34.0691 16.8998 34.0624 16.8219C34.0558 16.7439 34.0292 16.6695 33.9857 16.6072C33.9422 16.5448 33.8835 16.4969 33.8163 16.4689C33.7491 16.4409 33.6761 16.4339 33.6054 16.4487L30.5946 17.0801C30.5298 17.0936 30.4628 17.0887 30.4002 17.0661C30.3376 17.0434 30.2814 17.0036 30.237 16.9505C30.1925 16.8974 30.1614 16.8328 30.1464 16.7629C30.1315 16.6929 30.1333 16.62 30.1516 16.551L32.1157 9.13741C32.1342 9.06822 32.136 8.995 32.121 8.92482C32.1059 8.85463 32.0745 8.78984 32.0298 8.73669C31.9851 8.68354 31.9285 8.64381 31.8656 8.62133C31.8027 8.59886 31.7355 8.59439 31.6706 8.60837L31.6695 8.60954Z" fill="url(#paint1_linear_6_57)" />
                    <defs>
                        <linearGradient id="paint0_linear_6_57" x1="9.52775" y1="11.2475" x2="29.1792" y2="35.7718" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#41D1FF" />
                            <stop offset="1" stop-color="#BD34FE" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_6_57" x1="24.0834" y1="9.2171" x2="27.8541" y2="32.9863" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFEA83" />
                            <stop offset="0.083" stop-color="#FFDD35" />
                            <stop offset="1" stop-color="#FFA800" />
                        </linearGradient>
                    </defs>
                </svg>
                }

                {framework === 'cra\n' && <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38.2812 0H11.7188C5.24666 0 0 5.24666 0 11.7188V38.2812C0 44.7533 5.24666 50 11.7188 50H38.2812C44.7533 50 50 44.7533 50 38.2812V11.7188C50 5.24666 44.7533 0 38.2812 0Z" fill="#242938" />
                    <g clip-path="url(#clip0_6_56)">
                        <path d="M39.2411 23.3001C39.2411 21.568 37.2023 20.0319 34.0672 19.0941C34.8215 15.9089 34.492 13.3748 32.9913 12.5176C32.6233 12.3132 32.208 12.2092 31.7871 12.2159C30.3867 12.2159 28.617 13.1937 26.8295 14.8856C25.042 13.2063 23.2771 12.2334 21.8793 12.2334C21.4519 12.224 21.0298 12.3299 20.6575 12.5401C19.1641 13.3999 18.855 15.919 19.5992 19.0891C16.4792 20.0218 14.4504 21.5453 14.4454 23.27C14.4403 24.9945 16.4868 26.5382 19.6217 27.4734C18.8676 30.6612 19.1943 33.1927 20.6977 34.0499C21.0644 34.2555 21.4792 34.3596 21.8995 34.3517C23.3023 34.3517 25.0723 33.3737 26.8596 31.6818C28.6446 33.3611 30.4094 34.3341 31.8097 34.3341C32.2369 34.3419 32.6586 34.2361 33.0315 34.0275C34.5248 33.1676 34.8316 30.6486 34.0899 27.4909C37.2097 26.5457 39.2386 25.0222 39.2411 23.3001ZM27.9808 15.4538C30.0398 13.6111 31.327 13.4125 31.7846 13.4125C31.9968 13.4057 32.2069 13.456 32.393 13.5583C33.1119 13.9681 33.3986 15.4136 33.1697 17.3293C33.1111 17.8186 33.0272 18.3044 32.9184 18.785C31.8766 18.5428 30.8202 18.369 29.7557 18.2646C29.1219 17.3751 28.4298 16.5285 27.6841 15.7303C27.78 15.635 27.879 15.5428 27.9808 15.4538ZM21.7486 24.7256C21.9483 25.1074 22.1554 25.4854 22.3696 25.8593C22.5858 26.239 22.812 26.6237 23.0635 27.0032C22.4016 26.9087 21.744 26.7863 21.0925 26.6361C21.2684 25.9976 21.4921 25.3692 21.7486 24.7256ZM21.0523 19.9388C21.7108 19.7861 22.376 19.6636 23.0458 19.5718C22.7944 19.9439 22.5783 20.3261 22.3519 20.7258C22.1257 21.1254 21.9271 21.4799 21.7336 21.8621C21.4844 21.2291 21.2572 20.5876 21.0523 19.9388ZM22.362 23.2925C22.6802 22.6214 23.0232 21.9623 23.3903 21.3165C23.7652 20.6636 24.1652 20.0255 24.5894 19.4034C25.3209 19.3481 26.0752 19.318 26.8521 19.3205C27.6289 19.323 28.3605 19.3506 29.0871 19.4084C29.5043 20.0168 29.904 20.6655 30.2812 21.3064C30.6582 21.9476 31.0052 22.6188 31.3169 23.275C31.0009 23.946 30.6588 24.6043 30.2912 25.2485C29.9191 25.9022 29.5093 26.5508 29.092 27.1641C28.3605 27.222 27.6062 27.2496 26.8295 27.2496C26.0836 27.2493 25.338 27.2191 24.5945 27.159C24.1706 26.5425 23.7714 25.9093 23.3979 25.261C23.0207 24.6049 22.6863 23.9487 22.3721 23.2925H22.362ZM30.6231 19.5795C31.3068 19.6749 31.968 19.7981 32.5941 19.9439C32.4012 20.5861 32.1797 21.2195 31.9303 21.842C31.7297 21.4601 31.5219 21.0822 31.3069 20.7083C31.0881 20.3286 30.8569 19.9464 30.6331 19.5793H30.6231V19.5795ZM31.3169 25.8443C31.5304 25.4687 31.7366 25.089 31.9354 24.7054C32.1868 25.3591 32.4382 26.0027 32.6141 26.6311C31.9806 26.7795 31.3145 26.9002 30.6231 26.9956C30.869 26.6189 31.1037 26.2349 31.327 25.8443H31.3169ZM26.8344 16.5851C27.3026 17.0862 27.7473 17.6089 28.1668 18.1515C27.7288 18.1324 27.2905 18.1223 26.8521 18.1212C26.4071 18.1212 25.952 18.1212 25.5121 18.1515C25.942 17.5932 26.382 17.0678 26.8344 16.5851ZM21.2584 13.5684C21.4492 13.4669 21.6635 13.4184 21.8793 13.4276C22.3323 13.4465 22.7764 13.5585 23.1841 13.7569C24.1055 14.1912 24.9536 14.7663 25.6982 15.4614L25.9922 15.7305C25.2542 16.5227 24.5689 17.3625 23.9408 18.2444C22.8707 18.3481 21.8084 18.521 20.7606 18.7623C20.65 18.2747 20.5595 17.7969 20.5092 17.3369C20.2477 15.4388 20.5494 13.9908 21.2559 13.5784L21.2584 13.5684ZM19.9284 26.3144C19.4561 26.1702 18.9912 26.0024 18.5357 25.8116C16.7507 25.0573 15.6446 24.0894 15.6446 23.2624C15.6446 22.4354 16.7558 21.4724 18.5382 20.7308C18.9857 20.5455 19.4421 20.3827 19.9058 20.2431C20.2201 21.2846 20.6031 22.3042 21.0523 23.2951C20.6127 24.2761 20.2372 25.2846 19.9284 26.3144ZM25.7107 31.1161C23.6517 32.959 22.3645 33.155 21.9045 33.155C21.6923 33.1621 21.4821 33.1117 21.2961 33.0091C20.577 32.5995 20.2905 31.1538 20.5193 29.2382C20.5777 28.7497 20.6616 28.2647 20.7707 27.7851C21.8127 28.0251 22.8691 28.1981 23.9332 28.303C24.5663 29.1931 25.2584 30.0397 26.0048 30.8372L25.7107 31.1161ZM26.8596 29.9824C26.4071 29.4996 25.9621 28.9767 25.5247 28.4161C25.957 28.4363 26.397 28.4462 26.842 28.4462C27.2869 28.4462 27.742 28.4462 28.182 28.4186C27.7471 28.9767 27.3045 29.4996 26.8571 29.9824H26.8596ZM32.4357 32.9992C32.2449 33.1037 32.0296 33.1549 31.8122 33.1475C31.3546 33.1475 30.0524 32.9464 28.0009 31.1111L27.7068 30.8421C28.444 30.0498 29.1285 29.21 29.7557 28.3281C30.8269 28.2259 31.8901 28.0529 32.9384 27.8103C33.049 28.2979 33.137 28.7756 33.1899 29.2357C33.4388 31.1312 33.1496 32.5793 32.4332 32.9891L32.4357 32.9992ZM35.1507 25.8492C34.7028 26.0326 34.2465 26.1946 33.7831 26.3345C33.4676 25.2931 33.0839 24.2736 32.6343 23.2826C33.0759 22.3026 33.453 21.2948 33.7631 20.2657C34.2354 20.4099 34.7003 20.5777 35.1558 20.7685C36.9382 21.5227 38.047 22.4906 38.0445 23.3178C38.0418 24.1448 36.9333 25.0976 35.1482 25.8392L35.1509 25.8493L35.1507 25.8492ZM26.8344 25.593C28.1091 25.5943 29.1435 24.5622 29.1448 23.2875C29.1461 22.0129 28.1141 20.9785 26.8394 20.9772C25.5649 20.9759 24.5305 22.0079 24.529 23.2824C24.5284 23.5856 24.5875 23.8859 24.7031 24.1662C24.8186 24.4465 24.9883 24.7012 25.2025 24.9158C25.4166 25.1304 25.671 25.3007 25.951 25.4169C26.231 25.5331 26.5312 25.593 26.8344 25.593ZM11.4989 9.375V37.1925H42.1875V9.375H11.4989ZM40.9884 35.9958H12.7007V10.5741H40.9884V35.9958ZM19.6194 27.4734C18.8651 30.6612 19.1919 33.1927 20.6952 34.0499C21.0618 34.2555 21.4767 34.3596 21.897 34.3517C23.2998 34.3517 25.0697 33.3737 26.8571 31.6818C28.6421 33.3611 30.4069 34.3341 31.8071 34.3341C32.2344 34.3419 32.656 34.2361 33.029 34.0275C34.5223 33.1676 34.8291 30.6486 34.0874 27.4909C37.2072 26.5557 39.236 25.0324 39.2386 23.3102C39.2411 21.588 37.1998 20.0418 34.0647 19.1042C34.819 15.919 34.4895 13.3849 32.9888 12.5276C32.6208 12.3232 32.2055 12.2191 31.7846 12.2258C30.3842 12.2258 28.6145 13.2038 26.827 14.8957C25.0395 13.2164 23.2745 12.2434 21.8768 12.2434C21.4493 12.2341 21.0273 12.34 20.6549 12.5501C19.1616 13.41 18.8524 15.9291 19.5967 19.0992C16.4767 20.0319 14.4479 21.5553 14.4428 23.2799C14.4379 25.0046 16.4868 26.5331 19.6217 27.4734H19.6194ZM25.7056 31.1161C23.6466 32.959 22.3595 33.155 21.8995 33.155C21.6873 33.1621 21.4771 33.1117 21.2911 33.0091C20.5721 32.5995 20.2855 31.1538 20.5142 29.2382C20.5726 28.7497 20.6565 28.2647 20.7657 27.7851C21.8077 28.0251 22.864 28.1981 23.9282 28.303C24.5613 29.1931 25.2534 30.0397 25.9998 30.8372L25.7056 31.1161ZM31.9379 21.8421C31.7373 21.4602 31.5294 21.0821 31.3144 20.7081C31.0957 20.3285 30.8619 19.954 30.6307 19.5793C31.3144 19.6749 31.9756 19.7981 32.6016 19.9439C32.4107 20.5865 32.1901 21.2198 31.9404 21.842H31.9378L31.9379 21.8421ZM32.6217 26.6185C31.9882 26.7669 31.3221 26.8876 30.6306 26.9832C30.8707 26.6047 31.1021 26.2208 31.3244 25.8317C31.5394 25.4569 31.7457 25.0772 31.9429 24.6928C32.2068 25.3591 32.4357 25.9977 32.6167 26.6311L32.6217 26.6185ZM31.3118 23.2624C30.9959 23.9334 30.6537 24.5917 30.2862 25.2359C29.9141 25.8895 29.5043 26.5382 29.0871 27.1515C28.3555 27.2094 27.6012 27.237 26.8244 27.237C26.0785 27.2367 25.3329 27.2066 24.5894 27.1466C24.1656 26.53 23.7664 25.8968 23.3928 25.2485C23.023 24.6055 22.6775 23.9488 22.357 23.2799C22.6752 22.6088 23.0182 21.9497 23.3852 21.3039C23.7602 20.651 24.1602 20.0129 24.5844 19.3908C25.3372 19.3335 26.092 19.3058 26.847 19.3079C27.6239 19.3104 28.3555 19.338 29.082 19.3959C29.4992 20.0043 29.899 20.6529 30.2761 21.294C30.6531 21.935 31.0027 22.6188 31.3144 23.275L31.3118 23.2624ZM23.0635 27.0033C22.4016 26.9088 21.744 26.7863 21.0925 26.6361C21.2866 25.994 21.5089 25.3607 21.7586 24.7381C21.9584 25.1199 22.1655 25.4979 22.3797 25.8719C22.5958 26.2516 22.8122 26.6237 23.0635 27.0032V27.0033ZM22.362 20.7182C22.1452 21.0911 21.939 21.47 21.7436 21.8546C21.4876 21.2256 21.2569 20.5865 21.0523 19.939C21.7108 19.7862 22.376 19.6636 23.0458 19.5718C22.812 19.9439 22.5882 20.3285 22.362 20.7182ZM26.857 29.9823C26.4045 29.4996 25.9596 28.9767 25.5221 28.4161C25.9545 28.4363 26.3945 28.4462 26.8394 28.4462C27.2844 28.4462 27.7395 28.4462 28.1794 28.4186C27.7619 28.9591 27.3207 29.4808 26.8571 29.9824L26.857 29.9823ZM32.4332 32.9992C32.2424 33.1037 32.027 33.1549 31.8097 33.1475C31.3521 33.1475 30.0499 32.9464 27.9984 31.1111L27.7043 30.8421C28.4415 30.0498 29.1259 29.21 29.7532 28.3281C30.8244 28.2259 31.8876 28.0529 32.9359 27.8103C33.0465 28.2979 33.1345 28.7756 33.1873 29.2357C33.4388 31.1312 33.1496 32.5793 32.4332 32.9891V32.9992ZM33.7606 20.2631C34.2329 20.4074 34.6977 20.5752 35.1533 20.766C36.9357 21.5202 38.0445 22.4881 38.0419 23.3152C38.0393 24.1423 36.9332 25.1152 35.1482 25.8569C34.7003 26.0403 34.2439 26.2022 33.7806 26.3421C33.4651 25.3007 33.0813 24.2811 32.6318 23.2901C33.0742 22.3036 33.4513 21.2891 33.7606 20.2531V20.2631ZM27.9783 15.4639C30.0373 13.6212 31.3244 13.4226 31.782 13.4226C31.9942 13.4158 32.2044 13.4661 32.3904 13.5684C33.1094 13.9782 33.396 15.4237 33.1672 17.3394C33.1086 17.8286 33.0247 18.3145 32.9159 18.795C31.8741 18.5529 30.8176 18.3791 29.7532 18.2747C29.1193 17.3851 28.4273 16.5385 27.6816 15.7404C27.7763 15.6398 27.8762 15.5441 27.9808 15.4538L27.9783 15.4639ZM26.8344 16.5851C27.3026 17.0862 27.7473 17.6089 28.1668 18.1515C27.7288 18.1324 27.2905 18.1223 26.8521 18.1212C26.4071 18.1212 25.952 18.1212 25.5121 18.1515C25.942 17.5932 26.382 17.0678 26.8344 16.5851ZM21.2584 13.5684C21.4492 13.4669 21.6635 13.4184 21.8793 13.4276C22.3323 13.4465 22.7764 13.5585 23.1841 13.7569C24.1055 14.1912 24.9536 14.7663 25.6982 15.4614L25.9922 15.7305C25.2542 16.5227 24.5689 17.3625 23.9408 18.2444C22.8707 18.3481 21.8084 18.521 20.7606 18.7623C20.65 18.2747 20.5595 17.7969 20.5092 17.3369C20.2477 15.4388 20.5494 13.9908 21.2559 13.5784L21.2584 13.5684ZM18.5382 20.7308C18.9857 20.5455 19.4421 20.3827 19.9058 20.2431C20.2201 21.2846 20.6031 22.3042 21.0523 23.2951C20.6111 24.2751 20.234 25.2829 19.9235 26.3118C19.4511 26.1676 18.9862 25.9999 18.5307 25.8091C16.7457 25.0549 15.6396 24.0869 15.6396 23.2599C15.6396 22.4328 16.7558 21.4724 18.5382 20.7308ZM26.8344 20.9821C25.5598 20.9808 24.5254 22.0129 24.5241 23.2875C24.5228 24.5622 25.5548 25.5966 26.8295 25.5979C28.1039 25.5992 29.1384 24.5672 29.1398 23.2925C29.1421 22.9883 29.0841 22.6867 28.9693 22.4049C28.8545 22.1232 28.6851 21.867 28.4708 21.6511C28.2565 21.4351 28.0015 21.2637 27.7207 21.1468C27.4398 21.0298 27.1386 20.9696 26.8344 20.9696V20.9821ZM26.8344 20.9821C25.5598 20.9808 24.5254 22.0129 24.5241 23.2875C24.5228 24.5622 25.5548 25.5966 26.8295 25.5979C28.1039 25.5992 29.1384 24.5672 29.1398 23.2925C29.1421 22.9883 29.0841 22.6867 28.9693 22.4049C28.8545 22.1232 28.6851 21.867 28.4708 21.6511C28.2565 21.4351 28.0015 21.2637 27.7207 21.1468C27.4398 21.0298 27.1386 20.9696 26.8344 20.9696V20.9821ZM26.8344 20.9821C25.5598 20.9808 24.5254 22.0129 24.5241 23.2875C24.5228 24.5622 25.5548 25.5966 26.8295 25.5979C28.1039 25.5992 29.1384 24.5672 29.1398 23.2925C29.1421 22.9883 29.0841 22.6867 28.9693 22.4049C28.8545 22.1232 28.6851 21.867 28.4708 21.6511C28.2565 21.4351 28.0015 21.2637 27.7207 21.1468C27.4398 21.0298 27.1386 20.9696 26.8344 20.9696V20.9821ZM39.2411 23.3051C39.2411 21.573 37.2023 20.0368 34.0672 19.0992C34.8215 15.9139 34.492 13.3798 32.9913 12.5225C32.6233 12.3181 32.208 12.2141 31.7871 12.2208C30.3867 12.2208 28.617 13.1988 26.8295 14.8907C25.042 13.2115 23.2771 12.2384 21.8792 12.2384C21.4517 12.229 21.0297 12.3349 20.6573 12.5451C19.164 13.4049 18.8548 15.924 19.599 19.0941C16.4791 20.0268 14.4503 21.5503 14.4452 23.275C14.4402 24.9994 16.4867 26.5432 19.6216 27.4783C18.8674 30.6661 19.1942 33.1978 20.6976 34.0551C21.0642 34.2606 21.4791 34.3647 21.8994 34.3567C23.3021 34.3567 25.0721 33.3787 26.8595 31.6868C28.6445 33.3661 30.4093 34.3392 31.8095 34.3392C32.2368 34.347 32.6584 34.2411 33.0314 34.0325C34.5247 33.1726 34.8315 30.6536 34.0898 27.496C37.2096 26.5457 39.2386 25.0222 39.2411 23.3001V23.3051ZM27.9808 15.4538C30.0398 13.6111 31.327 13.4125 31.7846 13.4125C31.9968 13.4057 32.2069 13.456 32.393 13.5583C33.1119 13.9681 33.3986 15.4136 33.1697 17.3293C33.1111 17.8186 33.0272 18.3044 32.9184 18.785C31.8766 18.5428 30.8202 18.369 29.7557 18.2646C29.1219 17.3751 28.4298 16.5285 27.6841 15.7303C27.78 15.635 27.879 15.5428 27.9808 15.4538ZM21.7486 24.7256C21.9483 25.1074 22.1554 25.4852 22.3696 25.8591C22.5858 26.2388 22.812 26.6235 23.0635 27.0031C22.4016 26.9086 21.744 26.7861 21.0925 26.636C21.2684 25.9975 21.4921 25.3692 21.7486 24.7256ZM21.0523 19.9388C21.7108 19.7861 22.376 19.6636 23.0458 19.5718C22.7944 19.9439 22.5783 20.3261 22.3519 20.7258C22.1257 21.1254 21.9271 21.4799 21.7336 21.8621C21.4844 21.2291 21.2572 20.5876 21.0523 19.9388ZM22.362 23.2925C22.6802 22.6214 23.0232 21.9623 23.3903 21.3165C23.7652 20.6636 24.1652 20.0255 24.5894 19.4034C25.3209 19.3481 26.0752 19.318 26.8521 19.3205C27.6289 19.323 28.3605 19.3506 29.0871 19.4084C29.5043 20.0168 29.904 20.6655 30.2812 21.3064C30.6582 21.9476 31.0052 22.6188 31.3169 23.275C31.0009 23.946 30.6588 24.6043 30.2912 25.2485C29.9191 25.9022 29.5093 26.5506 29.092 27.164C28.3605 27.2218 27.6062 27.2495 26.8295 27.2495C26.0836 27.2492 25.338 27.2191 24.5945 27.159C24.1706 26.5425 23.7714 25.9093 23.3979 25.261C23.0207 24.6049 22.6863 23.9487 22.3721 23.2925H22.362ZM30.6231 19.5793C31.3068 19.6748 31.968 19.7981 32.5941 19.9439C32.4012 20.5861 32.1797 21.2195 31.9303 21.842C31.7297 21.4601 31.5219 21.0822 31.3069 20.7083C31.0881 20.3286 30.8569 19.9464 30.6331 19.5793H30.6231ZM31.3169 25.8443C31.5304 25.4687 31.7366 25.089 31.9354 24.7054C32.1868 25.3591 32.4382 26.0025 32.6141 26.631C31.9806 26.7794 31.3145 26.9002 30.6231 26.9956C30.869 26.6189 31.1037 26.2349 31.327 25.8443H31.3169ZM26.8344 16.5851C27.3026 17.0862 27.7473 17.6089 28.1668 18.1515C27.7288 18.1324 27.2905 18.1223 26.8521 18.1212C26.4071 18.1212 25.952 18.1212 25.5121 18.1515C25.942 17.5932 26.382 17.0678 26.8344 16.5851ZM21.2584 13.5684C21.4492 13.4669 21.6635 13.4184 21.8793 13.4276C22.3323 13.4465 22.7764 13.5585 23.1841 13.7569C24.1055 14.1912 24.9536 14.7663 25.6982 15.4614L25.9922 15.7305C25.2542 16.5227 24.5689 17.3625 23.9408 18.2444C22.8707 18.3481 21.8084 18.521 20.7606 18.7623C20.65 18.2747 20.5595 17.7969 20.5092 17.3369C20.2477 15.4388 20.5494 13.9908 21.2559 13.5784L21.2584 13.5684ZM19.9284 26.3144C19.4561 26.1702 18.9912 26.0024 18.5357 25.8116C16.7507 25.0573 15.6446 24.0894 15.6446 23.2624C15.6446 22.4354 16.7558 21.4724 18.5382 20.7308C18.9857 20.5455 19.4421 20.3827 19.9058 20.2431C20.2201 21.2846 20.6031 22.3042 21.0523 23.2951C20.6127 24.2761 20.2372 25.2846 19.9284 26.3144ZM25.7107 31.1161C23.6517 32.959 22.3645 33.155 21.9045 33.155C21.6923 33.1621 21.4821 33.1117 21.2961 33.0091C20.577 32.5995 20.2905 31.1538 20.5193 29.2382C20.5777 28.7497 20.6616 28.2647 20.7707 27.7851C21.8127 28.0251 22.8691 28.1981 23.9332 28.303C24.5663 29.1931 25.2584 30.0397 26.0048 30.8372L25.7107 31.1161ZM26.8596 29.9824C26.4071 29.4996 25.9621 28.9767 25.5247 28.4161C25.957 28.4363 26.397 28.4462 26.842 28.4462C27.2869 28.4462 27.742 28.4462 28.182 28.4186C27.7471 28.9767 27.3045 29.4996 26.8571 29.9824H26.8596ZM32.4357 32.9992C32.2449 33.1037 32.0296 33.1549 31.8122 33.1475C31.3546 33.1475 30.0524 32.9464 28.0009 31.1111L27.7068 30.8421C28.444 30.0498 29.1285 29.21 29.7557 28.3281C30.8269 28.2259 31.8901 28.0529 32.9384 27.8103C33.049 28.2979 33.137 28.7756 33.1899 29.2357C33.4388 31.1312 33.1496 32.5793 32.4332 32.9891L32.4357 32.9992ZM35.1507 25.8492C34.7028 26.0326 34.2465 26.1946 33.7831 26.3345C33.4676 25.2931 33.0839 24.2736 32.6343 23.2826C33.0759 22.3026 33.453 21.2948 33.7631 20.2657C34.2354 20.4099 34.7003 20.5777 35.1558 20.7685C36.9382 21.5227 38.047 22.4906 38.0445 23.3178C38.0418 24.1448 36.9333 25.0976 35.1482 25.8392L35.1509 25.8493L35.1507 25.8492ZM26.8344 25.593C28.1091 25.5943 29.1435 24.5622 29.1448 23.2875C29.1461 22.0129 28.1141 20.9785 26.8394 20.9772C25.5649 20.9759 24.5305 22.0079 24.529 23.2824C24.5284 23.5856 24.5875 23.8859 24.7031 24.1662C24.8186 24.4465 24.9883 24.7012 25.2025 24.9158C25.4166 25.1304 25.671 25.3007 25.951 25.4169C26.231 25.5331 26.5312 25.593 26.8344 25.593ZM9.40731 39.2941V11.4666L8.20312 12.6733V40.4934H38.8866L40.0883 39.2943H9.40731V39.2941Z" fill="#09D3AC" />
                    </g>
                    <defs>
                        <clipPath id="clip0_6_56">
                            <rect width="33.9844" height="31.1966" fill="white" transform="translate(8.20312 9.375)" />
                        </clipPath>
                    </defs>
                </svg>}



                <div className="card-body">
                    <Link href={`${projectId}?framework=${framework}&userId=${id}`} className="card-title">{props.project.title}</Link>

                    {isOnline
                        ? <a href={`https://${props.project.subdomain}.techsapien.dev`} className="link my-2 ml-auto">{props.project.subdomain}.techsapien.dev</a>
                        : <Link href={`${projectId}?framework=${framework}&userId=${id}`} className="link my-2 ml-auto">Build now</Link>}

                    <div className="ml-auto bg-white rounded-full cursor-pointer">
                        <a target={"_blank"} href={link}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="black" />
                            </svg>
                        </a>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Card;
