// Curated interactive menu data matching thequickwebsite.com/sample-salon/#services
export const CURATED_MENU_DATA = {
  hair: {
    key: "hair",
    tabLabel: "HAIR",
    title: "Hair",
    subtitle: "Cuts, colour and treatments by senior stylists.",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=900&q=75",
    alt: "Hair styling with curling iron",
    items: [
      {
        id: "sig-cut",
        name: "Signature Cut & Blow-dry",
        desc: "Consultation, wash, precision cut",
        price: "₹1,499",
        duration: "60 Mins",
        bookingService: "cut",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=75",
            alt: "Stylist precision cut and curling iron styling"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtwnBNMp8epRZf2CyREgF7Ka9dBmIGl5DgMRtQ9RxPASpz0fS6GN-jb8Wo4hShYBurlux6r5MWAmUegk2y-zrTeG6hL3Gso5TT-2B6wQyC4fssBWC51RvCel_YbeCC1P0y40fwe7_htSS5eYr4yg0pKkN1n34bl1pa12MmQ6p8xkAT34eGetfKYQCPHjpZU2rpHS2vsCXrnRxBCuXOHS4Ue9bt1qqRoj0GrkNYhF8j5nomg6MZHFjUg",
            alt: "Editorial caramel balayage waves finish"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD96Sl2X8Ob6o3orDSrll3gWwJpa-I7QtFYEMs-OANFLhxOCrU7-hmZLAdwl7WOWVrs6KCN70EYZChunHMDiPzXZa9H0G4rSryRlSuRwjcawLlazA5zQ0OSLRlD-BhMhlje7kGGBXY1LRpyenxrhsQ0lu-D8yaKR-3eN3XJ3rxXzFozLrb5ZZEI7zBsJUKcqEbGJZXqOcKXsRbMBnjWUeXg9isaJbYuCCG99ygn2U2xb9i80uNocKPuSg",
            alt: "Close-up glossy texture"
          }
        ]
      },
      {
        id: "global-colour",
        name: "Global Colour",
        desc: "Ammonia-free, root to tip",
        price: "₹3,999",
        duration: "2 Hours",
        bookingService: "colour",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD96Sl2X8Ob6o3orDSrll3gWwJpa-I7QtFYEMs-OANFLhxOCrU7-hmZLAdwl7WOWVrs6KCN70EYZChunHMDiPzXZa9H0G4rSryRlSuRwjcawLlazA5zQ0OSLRlD-BhMhlje7kGGBXY1LRpyenxrhsQ0lu-D8yaKR-3eN3XJ3rxXzFozLrb5ZZEI7zBsJUKcqEbGJZXqOcKXsRbMBnjWUeXg9isaJbYuCCG99ygn2U2xb9i80uNocKPuSg",
            alt: "Glossy multi-tonal dimensional hair reflection"
          },
          {
            url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=75",
            alt: "Hair stylist working in luminous salon station"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtwnBNMp8epRZf2CyREgF7Ka9dBmIGl5DgMRtQ9RxPASpz0fS6GN-jb8Wo4hShYBurlux6r5MWAmUegk2y-zrTeG6hL3Gso5TT-2B6wQyC4fssBWC51RvCel_YbeCC1P0y40fwe7_htSS5eYr4yg0pKkN1n34bl1pa12MmQ6p8xkAT34eGetfKYQCPHjpZU2rpHS2vsCXrnRxBCuXOHS4Ue9bt1qqRoj0GrkNYhF8j5nomg6MZHFjUg",
            alt: "Root to tip rich dimensional tone"
          }
        ]
      },
      {
        id: "balayage-gloss",
        name: "Balayage & Gloss",
        desc: "Hand-painted, toner included",
        price: "₹7,999",
        duration: "3.5 Hours",
        bookingService: "balayage",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD96Sl2X8Ob6o3orDSrll3gWwJpa-I7QtFYEMs-OANFLhxOCrU7-hmZLAdwl7WOWVrs6KCN70EYZChunHMDiPzXZa9H0G4rSryRlSuRwjcawLlazA5zQ0OSLRlD-BhMhlje7kGGBXY1LRpyenxrhsQ0lu-D8yaKR-3eN3XJ3rxXzFozLrb5ZZEI7zBsJUKcqEbGJZXqOcKXsRbMBnjWUeXg9isaJbYuCCG99ygn2U2xb9i80uNocKPuSg",
            alt: "Dimensional blonde balayage ribbons"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtwnBNMp8epRZf2CyREgF7Ka9dBmIGl5DgMRtQ9RxPASpz0fS6GN-jb8Wo4hShYBurlux6r5MWAmUegk2y-zrTeG6hL3Gso5TT-2B6wQyC4fssBWC51RvCel_YbeCC1P0y40fwe7_htSS5eYr4yg0pKkN1n34bl1pa12MmQ6p8xkAT34eGetfKYQCPHjpZU2rpHS2vsCXrnRxBCuXOHS4Ue9bt1qqRoj0GrkNYhF8j5nomg6MZHFjUg",
            alt: "Model showing soft waves after balayage"
          },
          {
            url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=75",
            alt: "Balayage hand-painting technique"
          }
        ]
      },
      {
        id: "keratin-smooth",
        name: "Keratin Smoothening",
        desc: "Frizz-free for up to 4 months",
        price: "₹5,999",
        duration: "2.5 Hours",
        bookingService: "keratin",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD96Sl2X8Ob6o3orDSrll3gWwJpa-I7QtFYEMs-OANFLhxOCrU7-hmZLAdwl7WOWVrs6KCN70EYZChunHMDiPzXZa9H0G4rSryRlSuRwjcawLlazA5zQ0OSLRlD-BhMhlje7kGGBXY1LRpyenxrhsQ0lu-D8yaKR-3eN3XJ3rxXzFozLrb5ZZEI7zBsJUKcqEbGJZXqOcKXsRbMBnjWUeXg9isaJbYuCCG99ygn2U2xb9i80uNocKPuSg",
            alt: "Silky smooth straightened hair texture"
          },
          {
            url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=75",
            alt: "Salon heat styling treatment"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtwnBNMp8epRZf2CyREgF7Ka9dBmIGl5DgMRtQ9RxPASpz0fS6GN-jb8Wo4hShYBurlux6r5MWAmUegk2y-zrTeG6hL3Gso5TT-2B6wQyC4fssBWC51RvCel_YbeCC1P0y40fwe7_htSS5eYr4yg0pKkN1n34bl1pa12MmQ6p8xkAT34eGetfKYQCPHjpZU2rpHS2vsCXrnRxBCuXOHS4Ue9bt1qqRoj0GrkNYhF8j5nomg6MZHFjUg",
            alt: "Smooth glossy finish"
          }
        ]
      },
      {
        id: "luxury-hair-spa",
        name: "Luxury Hair Spa",
        desc: "Deep repair ritual",
        price: "₹1,999",
        duration: "50 Mins",
        bookingService: "hairspa",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZrFSkaYAt4ajvau70Q14gfSKpMC0JuLEBF_qxvIJ9QBHzd6loI8zgtniGje1iRnho4OztO18SiM2HnP2ElGuqYx_4nTCjEdnGYm5ly99QyV_b6TKV_AdP3egi41ofnJViLFoWmH0JUNe0atr_1ZzyetLiv3-BTD4gN3Z4JBJJNez8VPRZW1nSvfF57m72gr-8KD7IhRfenrPhPxIeRwBhi7R2p7vj90wSiRC7t935RG4YYZWE_sgdnQ",
            alt: "Aromatic scalp spa treatment basin"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDftblWi2CvtvUnmE391GMCJEoairiBBspf9uLp0NxzMGZ9KwvaeWiEPROasXcI_Kr40piK0C44WMdD22gxwDJ2eemJkibGgLD9sKcgQqr19MIG5hnWUNTAg9PEp8VfmQi77Gnfz6oQU_-edUPlimEYZ8m3K-L5-F1RjcdcbpouQj8wRRoM70mJOwSZenYh94ukgpHFMZ5GpDOp-UPjOlyQxtVmmB7KSbLs3erZMsB66r1xt9_w3wCxFg",
            alt: "Serene wash lounge atmosphere"
          },
          {
            url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=75",
            alt: "Scalp and hair nourishment"
          }
        ]
      }
    ]
  },
  skin: {
    key: "skin",
    tabLabel: "SKIN",
    title: "Skin",
    subtitle: "Facials and treatments for a lit-from-within glow.",
    imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=75",
    alt: "Aesthetic skin facial treatment",
    items: [
      {
        id: "glow-facial",
        name: "Glow Facial Ritual",
        desc: "90 min signature facial",
        price: "₹3,499",
        duration: "90 Mins",
        bookingService: "glowfacial",
        subCategories: [
          { id: "glow-basic", name: "Basic Express Glow", duration: "45 Mins", price: "₹2,499" },
          { id: "glow-mid", name: "Mid Bio-Active Hydra Infusion", duration: "60 Mins", price: "₹2,999" },
          { id: "glow-adv", name: "Advanced 90-Min Signature Ritual", duration: "90 Mins", price: "₹3,499" },
        ],
        photos: [
          {
            url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=75",
            alt: "Relaxing glowing facial spa treatment"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdKRSPjtWgS-2CJZ0waakX4WxgOsI92r1MyehHP-J5NZcwobgT4GQBjlv8-U68rVo09yNqzn34lGwZn0Is5zyCBnCEzCOBDyTu2Bt3M4FdatIIpG5DgkGMoSj41ZthcxKL1PVlO7Cg9exSJ0YxJcJ96-LWliY1Nv2WFvJp5Nj3Lpsmv1B1F3kWky3ez4RiUbWGiKZHxVdG0Evq-fLDAdTGpGyczbJKYvnsBcr-fVlXiZ_ItFxy2D3Ljw",
            alt: "Jade stone facial massage close-up"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Botanical compresses and herbal tea set"
          }
        ]
      },
      {
        id: "hydra-facial",
        name: "Hydra Facial",
        desc: "Deep cleanse & hydration",
        price: "₹4,499",
        duration: "60 Mins",
        bookingService: "hydrafacial",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=75",
            alt: "Hydrating facial treatment"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdKRSPjtWgS-2CJZ0waakX4WxgOsI92r1MyehHP-J5NZcwobgT4GQBjlv8-U68rVo09yNqzn34lGwZn0Is5zyCBnCEzCOBDyTu2Bt3M4FdatIIpG5DgkGMoSj41ZthcxKL1PVlO7Cg9exSJ0YxJcJ96-LWliY1Nv2WFvJp5Nj3Lpsmv1B1F3kWky3ez4RiUbWGiKZHxVdG0Evq-fLDAdTGpGyczbJKYvnsBcr-fVlXiZ_ItFxy2D3Ljw",
            alt: "Botanical skincare application"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb8yieSls0F6wL3LAtUVCmfGJ8kKGBcS_r2QDM5t7Z7KsEiHDwGR14sUotqFCO01p9ufD-oAHMCnHdVs84yhpcX5qipBtkAIeAkSwq_ce_x-euY0PbLBBybHubd-D_29826CRicaydBS95awNJxr-Dcn6fjjgUdjzCOkTTYscddxCWoR7IDHtrd3qKfZsf_WeSBYcIz_8uFnvExqJaEiJaxGqD6E2M40dSQ5OrsTZ78cCDHM5o_AOEAQ",
            alt: "Quiet luxury spa room"
          }
        ]
      },
      {
        id: "brightening-peel",
        name: "Brightening Peel",
        desc: "Even tone, smoother texture",
        price: "₹2,999",
        duration: "45 Mins",
        bookingService: "glowfacial",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdKRSPjtWgS-2CJZ0waakX4WxgOsI92r1MyehHP-J5NZcwobgT4GQBjlv8-U68rVo09yNqzn34lGwZn0Is5zyCBnCEzCOBDyTu2Bt3M4FdatIIpG5DgkGMoSj41ZthcxKL1PVlO7Cg9exSJ0YxJcJ96-LWliY1Nv2WFvJp5Nj3Lpsmv1B1F3kWky3ez4RiUbWGiKZHxVdG0Evq-fLDAdTGpGyczbJKYvnsBcr-fVlXiZ_ItFxy2D3Ljw",
            alt: "Dermal clarifying peel ritual"
          },
          {
            url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=75",
            alt: "Even skin tone therapy"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Aromatherapy relaxation"
          }
        ]
      },
      {
        id: "detan-cleanup",
        name: "De-tan & Clean-up",
        desc: "Quick refresh",
        price: "₹1,299",
        duration: "30 Mins",
        bookingService: "glowfacial",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=75",
            alt: "Express clean-up treatment"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdKRSPjtWgS-2CJZ0waakX4WxgOsI92r1MyehHP-J5NZcwobgT4GQBjlv8-U68rVo09yNqzn34lGwZn0Is5zyCBnCEzCOBDyTu2Bt3M4FdatIIpG5DgkGMoSj41ZthcxKL1PVlO7Cg9exSJ0YxJcJ96-LWliY1Nv2WFvJp5Nj3Lpsmv1B1F3kWky3ez4RiUbWGiKZHxVdG0Evq-fLDAdTGpGyczbJKYvnsBcr-fVlXiZ_ItFxy2D3Ljw",
            alt: "Botanical mask application"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Serene treatment space"
          }
        ]
      }
    ]
  },
  nails: {
    key: "nails",
    tabLabel: "NAILS",
    title: "Nails",
    subtitle: "Long-lasting gels, art and pampering hand care.",
    imageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=75",
    alt: "Manicure and nail care art",
    items: [
      {
        id: "gel-manicure",
        name: "Gel Manicure",
        desc: "Shape, cuticle care, gel colour",
        price: "₹1,199",
        duration: "60 Mins",
        bookingService: "gelmanicure",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=75",
            alt: "Precision gel manicure"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwPkCzrZj0Td3_xHzTosc6gusPZ2L-NMZxpknlZmIj1z1UGBlx9iVGi0k7wpCNzKf1wYMjBXNqFV_W5jCa5e1krGRvHdWMcmM0f_qjsdZFIscYneGPTIGtl9D7BF9xBOVlnvR-dlA00Tqomrm2Cyx9FevxPTcrlW2F5d2tMOyILJEwtynACd7Dzt-In2a2F8s3ncC49fS5z2PELv5DJEzlrNStQLgOIfVjSap6vwKxvvuOb3NY8roofg",
            alt: "Chrome glazed tips manicure"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Hand spa and linen towels"
          }
        ]
      },
      {
        id: "spa-pedicure",
        name: "Spa Pedicure",
        desc: "Scrub, massage, polish",
        price: "₹1,499",
        duration: "60 Mins",
        bookingService: "gelmanicure",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=75",
            alt: "Spa pedicure foot care"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwPkCzrZj0Td3_xHzTosc6gusPZ2L-NMZxpknlZmIj1z1UGBlx9iVGi0k7wpCNzKf1wYMjBXNqFV_W5jCa5e1krGRvHdWMcmM0f_qjsdZFIscYneGPTIGtl9D7BF9xBOVlnvR-dlA00Tqomrm2Cyx9FevxPTcrlW2F5d2tMOyILJEwtynACd7Dzt-In2a2F8s3ncC49fS5z2PELv5DJEzlrNStQLgOIfVjSap6vwKxvvuOb3NY8roofg",
            alt: "Refined nail polish finish"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZrFSkaYAt4ajvau70Q14gfSKpMC0JuLEBF_qxvIJ9QBHzd6loI8zgtniGje1iRnho4OztO18SiM2HnP2ElGuqYx_4nTCjEdnGYm5ly99QyV_b6TKV_AdP3egi41ofnJViLFoWmH0JUNe0atr_1ZzyetLiv3-BTD4gN3Z4JBJJNez8VPRZW1nSvfF57m72gr-8KD7IhRfenrPhPxIeRwBhi7R2p7vj90wSiRC7t935RG4YYZWE_sgdnQ",
            alt: "Relaxing foot bath therapy"
          }
        ]
      },
      {
        id: "nail-art",
        name: "Nail Art (per set)",
        desc: "Chrome, ombré, French & more",
        price: "₹999",
        duration: "45 Mins",
        bookingService: "gelmanicure",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwPkCzrZj0Td3_xHzTosc6gusPZ2L-NMZxpknlZmIj1z1UGBlx9iVGi0k7wpCNzKf1wYMjBXNqFV_W5jCa5e1krGRvHdWMcmM0f_qjsdZFIscYneGPTIGtl9D7BF9xBOVlnvR-dlA00Tqomrm2Cyx9FevxPTcrlW2F5d2tMOyILJEwtynACd7Dzt-In2a2F8s3ncC49fS5z2PELv5DJEzlrNStQLgOIfVjSap6vwKxvvuOb3NY8roofg",
            alt: "Minimalist glazed French tip art"
          },
          {
            url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=75",
            alt: "Delicate nail artwork design"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Chic aesthetic vanity setup"
          }
        ]
      },
      {
        id: "acrylic-ext",
        name: "Acrylic Extensions",
        desc: "Full set with design",
        price: "₹2,499",
        duration: "90 Mins",
        bookingService: "gelmanicure",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=75",
            alt: "Sculpted nail extensions"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwPkCzrZj0Td3_xHzTosc6gusPZ2L-NMZxpknlZmIj1z1UGBlx9iVGi0k7wpCNzKf1wYMjBXNqFV_W5jCa5e1krGRvHdWMcmM0f_qjsdZFIscYneGPTIGtl9D7BF9xBOVlnvR-dlA00Tqomrm2Cyx9FevxPTcrlW2F5d2tMOyILJEwtynACd7Dzt-In2a2F8s3ncC49fS5z2PELv5DJEzlrNStQLgOIfVjSap6vwKxvvuOb3NY8roofg",
            alt: "Almond shaped extensions"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Clean salon setup"
          }
        ]
      }
    ]
  },
  makeup: {
    key: "makeup",
    tabLabel: "MAKEUP",
    title: "Makeup",
    subtitle: "HD and airbrush looks for every occasion.",
    imageUrl: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?auto=format&fit=crop&w=900&q=75",
    alt: "Professional beauty makeup backstage",
    items: [
      {
        id: "party-makeup",
        name: "Party Makeup",
        desc: "HD makeup with lashes",
        price: "₹3,999",
        duration: "60 Mins",
        bookingService: "redcarpet",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?auto=format&fit=crop&w=600&q=75",
            alt: "Backstage evening party glam"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMEAXn1NlUzKqd8I2ordayj03JB83-7t26XKTyoJ0YPH9tJTQmF5byVKKovkIKnqCk-Ok-V7TJMTlM4PTz895dJRaos3WTrKSgYZ1xbF1S0WzmY7628hOVZS_jopqo5rNymVUFCgGWy-4I7cuk0oLl7u7dUhyeUqcb35OVJ3-ks1x3AAE85EA7MEE-1-YWXVwdEfjPn6YhD7FRoO1u8dYPbfgc2lALjhbVtNrrugrTCWYjP87FcmzAjA",
            alt: "Red carpet glam beauty"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqxWuWILYgMCelGVeURefResk57rfrjdcZpQ8tSE6iWBc0mulhJ4Lu32RHzKJ3kY7frZzFjeHf_IYSaXEyjRMqlPK6Tyn4fTelIZ-aO_vfqSSbl8rRhIkiIxJ5FPOIP6VXZaQ1118JR9w6Bv5DpiNnPGmPqbwzh-7ZmS9pZ3mP6v7_zVZ9dZB5k3Q9pwqKPUSJMxrnylBuoP_gMYZNcWaFxh3cCpdeubVvHsblXwct9b3k7q5R7DNt9Q",
            alt: "Lead artist applying makeup brush"
          }
        ]
      },
      {
        id: "red-carpet-glam",
        name: "Red Carpet Glam",
        desc: "Makeup + hairstyling",
        price: "₹5,499",
        duration: "90 Mins",
        bookingService: "redcarpet",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMEAXn1NlUzKqd8I2ordayj03JB83-7t26XKTyoJ0YPH9tJTQmF5byVKKovkIKnqCk-Ok-V7TJMTlM4PTz895dJRaos3WTrKSgYZ1xbF1S0WzmY7628hOVZS_jopqo5rNymVUFCgGWy-4I7cuk0oLl7u7dUhyeUqcb35OVJ3-ks1x3AAE85EA7MEE-1-YWXVwdEfjPn6YhD7FRoO1u8dYPbfgc2lALjhbVtNrrugrTCWYjP87FcmzAjA",
            alt: "Luminous red carpet makeup finish"
          },
          {
            url: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?auto=format&fit=crop&w=600&q=75",
            alt: "Backstage artist makeup application"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtwnBNMp8epRZf2CyREgF7Ka9dBmIGl5DgMRtQ9RxPASpz0fS6GN-jb8Wo4hShYBurlux6r5MWAmUegk2y-zrTeG6hL3Gso5TT-2B6wQyC4fssBWC51RvCel_YbeCC1P0y40fwe7_htSS5eYr4yg0pKkN1n34bl1pa12MmQ6p8xkAT34eGetfKYQCPHjpZU2rpHS2vsCXrnRxBCuXOHS4Ue9bt1qqRoj0GrkNYhF8j5nomg6MZHFjUg",
            alt: "Hair and makeup harmony"
          }
        ]
      },
      {
        id: "engagement-look",
        name: "Engagement Look",
        desc: "Airbrush finish",
        price: "₹9,999",
        duration: "2 Hours",
        bookingService: "redcarpet",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMEAXn1NlUzKqd8I2ordayj03JB83-7t26XKTyoJ0YPH9tJTQmF5byVKKovkIKnqCk-Ok-V7TJMTlM4PTz895dJRaos3WTrKSgYZ1xbF1S0WzmY7628hOVZS_jopqo5rNymVUFCgGWy-4I7cuk0oLl7u7dUhyeUqcb35OVJ3-ks1x3AAE85EA7MEE-1-YWXVwdEfjPn6YhD7FRoO1u8dYPbfgc2lALjhbVtNrrugrTCWYjP87FcmzAjA",
            alt: "Engagement bridal makeup"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqxWuWILYgMCelGVeURefResk57rfrjdcZpQ8tSE6iWBc0mulhJ4Lu32RHzKJ3kY7frZzFjeHf_IYSaXEyjRMqlPK6Tyn4fTelIZ-aO_vfqSSbl8rRhIkiIxJ5FPOIP6VXZaQ1118JR9w6Bv5DpiNnPGmPqbwzh-7ZmS9pZ3mP6v7_zVZ9dZB5k3Q9pwqKPUSJMxrnylBuoP_gMYZNcWaFxh3cCpdeubVvHsblXwct9b3k7q5R7DNt9Q",
            alt: "Delicate bridal eyeshadow application"
          },
          {
            url: "https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?auto=format&fit=crop&w=600&q=75",
            alt: "Glowing studio finish"
          }
        ]
      },
      {
        id: "bridal-makeup",
        name: "Bridal Makeup",
        desc: "Full bridal package",
        price: "from ₹24,999",
        duration: "3 Hours",
        bookingService: "redcarpet",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqxWuWILYgMCelGVeURefResk57rfrjdcZpQ8tSE6iWBc0mulhJ4Lu32RHzKJ3kY7frZzFjeHf_IYSaXEyjRMqlPK6Tyn4fTelIZ-aO_vfqSSbl8rRhIkiIxJ5FPOIP6VXZaQ1118JR9w6Bv5DpiNnPGmPqbwzh-7ZmS9pZ3mP6v7_zVZ9dZB5k3Q9pwqKPUSJMxrnylBuoP_gMYZNcWaFxh3cCpdeubVvHsblXwct9b3k7q5R7DNt9Q",
            alt: "Couture bride perfection"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMEAXn1NlUzKqd8I2ordayj03JB83-7t26XKTyoJ0YPH9tJTQmF5byVKKovkIKnqCk-Ok-V7TJMTlM4PTz895dJRaos3WTrKSgYZ1xbF1S0WzmY7628hOVZS_jopqo5rNymVUFCgGWy-4I7cuk0oLl7u7dUhyeUqcb35OVJ3-ks1x3AAE85EA7MEE-1-YWXVwdEfjPn6YhD7FRoO1u8dYPbfgc2lALjhbVtNrrugrTCWYjP87FcmzAjA",
            alt: "Bridal glow portrait"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Private bridal consultation suite"
          }
        ]
      }
    ]
  },
  spa: {
    key: "spa",
    tabLabel: "SPA",
    title: "Spa",
    subtitle: "Unwind with rituals designed to restore.",
    imageUrl: "https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?auto=format&fit=crop&w=900&q=75",
    alt: "Relaxing wellness spa treatment",
    items: [
      {
        id: "swedish-massage",
        name: "Swedish Massage",
        desc: "60 min full body",
        price: "₹2,999",
        duration: "60 Mins",
        bookingService: "massage",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?auto=format&fit=crop&w=600&q=75",
            alt: "Relaxing massage therapy session"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Private spa suite relaxation"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZrFSkaYAt4ajvau70Q14gfSKpMC0JuLEBF_qxvIJ9QBHzd6loI8zgtniGje1iRnho4OztO18SiM2HnP2ElGuqYx_4nTCjEdnGYm5ly99QyV_b6TKV_AdP3egi41ofnJViLFoWmH0JUNe0atr_1ZzyetLiv3-BTD4gN3Z4JBJJNez8VPRZW1nSvfF57m72gr-8KD7IhRfenrPhPxIeRwBhi7R2p7vj90wSiRC7t935RG4YYZWE_sgdnQ",
            alt: "Herbal scalp rinse treatment"
          }
        ]
      },
      {
        id: "aromatherapy",
        name: "Aromatherapy Ritual",
        desc: "75 min with essential oils",
        price: "₹3,799",
        duration: "75 Mins",
        bookingService: "massage",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?auto=format&fit=crop&w=600&q=75",
            alt: "Aromatherapy oils treatment"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Herbal compresses in private suite"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZrFSkaYAt4ajvau70Q14gfSKpMC0JuLEBF_qxvIJ9QBHzd6loI8zgtniGje1iRnho4OztO18SiM2HnP2ElGuqYx_4nTCjEdnGYm5ly99QyV_b6TKV_AdP3egi41ofnJViLFoWmH0JUNe0atr_1ZzyetLiv3-BTD4gN3Z4JBJJNez8VPRZW1nSvfF57m72gr-8KD7IhRfenrPhPxIeRwBhi7R2p7vj90wSiRC7t935RG4YYZWE_sgdnQ",
            alt: "Scalp and essential oils therapy"
          }
        ]
      },
      {
        id: "hot-stone",
        name: "Hot Stone Therapy",
        desc: "90 min deep relaxation",
        price: "₹4,499",
        duration: "90 Mins",
        bookingService: "massage",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?auto=format&fit=crop&w=600&q=75",
            alt: "Hot stone therapy session"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Heated stone therapy room"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZrFSkaYAt4ajvau70Q14gfSKpMC0JuLEBF_qxvIJ9QBHzd6loI8zgtniGje1iRnho4OztO18SiM2HnP2ElGuqYx_4nTCjEdnGYm5ly99QyV_b6TKV_AdP3egi41ofnJViLFoWmH0JUNe0atr_1ZzyetLiv3-BTD4gN3Z4JBJJNez8VPRZW1nSvfF57m72gr-8KD7IhRfenrPhPxIeRwBhi7R2p7vj90wSiRC7t935RG4YYZWE_sgdnQ",
            alt: "Volcanic stone treatment"
          }
        ]
      },
      {
        id: "head-shoulder",
        name: "Head & Shoulder Massage",
        desc: "30 min express",
        price: "₹999",
        duration: "30 Mins",
        bookingService: "massage",
        photos: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZrFSkaYAt4ajvau70Q14gfSKpMC0JuLEBF_qxvIJ9QBHzd6loI8zgtniGje1iRnho4OztO18SiM2HnP2ElGuqYx_4nTCjEdnGYm5ly99QyV_b6TKV_AdP3egi41ofnJViLFoWmH0JUNe0atr_1ZzyetLiv3-BTD4gN3Z4JBJJNez8VPRZW1nSvfF57m72gr-8KD7IhRfenrPhPxIeRwBhi7R2p7vj90wSiRC7t935RG4YYZWE_sgdnQ",
            alt: "Scalp and neck tension release"
          },
          {
            url: "https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?auto=format&fit=crop&w=600&q=75",
            alt: "Acupressure therapy"
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_SLGp4Lgkce95b1n1cxO4cvKrVjvxbX6U3k3ZTB0vn3DC0gswqbuoJ1vg7VilefwsHmzFCIgXQfq9NMavGxeOV9_t-45KDKBia9zhenj_yFxlmgiabGOYbRq21PH0v7G6zj8YD2qdakPbAXgQ-KAOp0mnAVA-TP5pE_Ho3y0OWH-5o3DC1yVC3giU48uFyw6bEv60G6FA5Zn1LynsWPnPKAQaRAsWhoNC5SoevjH7LEGSwDOonJFcQ",
            alt: "Relaxing neck care"
          }
        ]
      }
    ]
  }
};

export const BOOKING_SERVICES_LIST = [
  { value: "cut", label: "Signature Cut & Blow-dry (₹1,499)", category: "hair" },
  { value: "colour", label: "Global Colour (₹3,999)", category: "hair" },
  { value: "balayage", label: "Balayage & Gloss (₹7,999)", category: "hair" },
  { value: "keratin", label: "Keratin Smoothening (₹5,999)", category: "hair" },
  { value: "hairspa", label: "Luxury Hair Spa (₹1,999)", category: "hair" },
  { value: "glowfacial", label: "Glow Facial Ritual (₹3,499)", category: "skin" },
  { value: "hydrafacial", label: "Hydra Facial (₹4,499)", category: "skin" },
  { value: "gelmanicure", label: "Gel Manicure (₹1,199)", category: "nails" },
  { value: "redcarpet", label: "Red Carpet Glam (₹5,499)", category: "makeup" },
  { value: "massage", label: "Swedish Massage (₹2,999)", category: "spa" }
];


/**
 * Service Data Model Normalization Helpers
 */
export function normalizeServiceImage(img, defaultAlt = '') {
  if (!img) return null;
  if (typeof img === 'string') {
    return {
      url: img,
      path: '',
      alt: defaultAlt || 'Service photo',
    };
  }
  return {
    url: img.url || img.src || '',
    path: img.path || img.filePath || '',
    alt: img.alt || defaultAlt || 'Service photo',
  };
}

export function normalizeServiceImages(images, defaultAlt = '') {
  if (!Array.isArray(images)) {
    if (images && typeof images === 'object') {
      const single = normalizeServiceImage(images, defaultAlt);
      return single?.url ? [single] : [];
    }
    if (typeof images === 'string' && images.trim()) {
      return [{ url: images.trim(), path: '', alt: defaultAlt || 'Service photo' }];
    }
    return [];
  }
  return images.map((img) => normalizeServiceImage(img, defaultAlt)).filter((img) => img && img.url);
}

export function normalizeServiceSubplan(rawSub, idx = 0) {
  if (!rawSub) return null;
  const rawPrice = rawSub.price;
  const numPrice =
    typeof rawPrice === 'number'
      ? rawPrice
      : Number(String(rawPrice || '0').replace(/[^0-9.]/g, '')) || 0;

  return {
    id: String(rawSub.id || 'subplan-' + Date.now() + '-' + idx),
    name: String(rawSub.name || 'Option ' + (idx + 1)).trim(),
    price: numPrice,
  };
}

export function normalizeServicePlan(rawPlan, planIdx = 0) {
  if (!rawPlan) return null;

  let subplans = [];
  const rawSubs = Array.isArray(rawPlan.subplans) && rawPlan.subplans.length > 0
    ? rawPlan.subplans
    : Array.isArray(rawPlan.subCategories) && rawPlan.subCategories.length > 0
    ? rawPlan.subCategories
    : [];

  if (rawSubs.length > 0) {
    subplans = rawSubs
      .map((sub, sIdx) => normalizeServiceSubplan(sub, sIdx))
      .filter(Boolean);
  } else if (rawPlan.price) {
    const basePrice =
      typeof rawPlan.price === 'number'
        ? rawPlan.price
        : Number(String(rawPlan.price).replace(/[^0-9.]/g, '')) || 1499;
    subplans = [
      { id: 'sub-' + (rawPlan.id || planIdx) + '-basic', name: 'Basic', price: basePrice },
      { id: 'sub-' + (rawPlan.id || planIdx) + '-mid', name: 'Mid', price: Math.round(basePrice * 1.35) },
      { id: 'sub-' + (rawPlan.id || planIdx) + '-adv', name: 'Advanced', price: Math.round(basePrice * 1.75) },
    ];
  } else {
    subplans = [
      { id: 'sub-' + Date.now() + '-1', name: 'Basic', price: 999 },
    ];
  }

  let startingPrice = Number(rawPlan.startingPrice);
  if (isNaN(startingPrice) || startingPrice <= 0) {
    const prices = subplans.map((s) => s.price).filter((p) => typeof p === 'number' && p > 0);
    startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
  }

  const images = normalizeServiceImages(rawPlan.images || rawPlan.photos, rawPlan.name);

  return {
    id: String(rawPlan.id || 'plan-' + Date.now() + '-' + planIdx),
    name: String(rawPlan.name || rawPlan.title || 'Plan ' + (planIdx + 1)).trim(),
    description: String(rawPlan.description || rawPlan.desc || '').trim(),
    images,
    startingPrice,
    subplans,
  };
}

export function normalizeService(rawSvc, svcIdx = 0) {
  if (!rawSvc) return null;

  const id = String(rawSvc.id || rawSvc.key || 'service-' + Date.now() + '-' + svcIdx);
  const name = String(rawSvc.name || rawSvc.title || 'Untitled Service').trim();
  const description = String(rawSvc.description || rawSvc.subtitle || '').trim();

  let images = normalizeServiceImages(rawSvc.images, name);
  if (images.length === 0 && rawSvc.imageUrl) {
    images = [{ url: rawSvc.imageUrl, path: '', alt: name }];
  }
  if (images.length === 0 && rawSvc.image) {
    images = [{ url: rawSvc.image, path: '', alt: name }];
  }

  const rawPlans = Array.isArray(rawSvc.plans)
    ? rawSvc.plans
    : Array.isArray(rawSvc.pricePlans)
    ? rawSvc.pricePlans
    : Array.isArray(rawSvc.items)
    ? rawSvc.items
    : [];

  const plans = rawPlans.map((p, idx) => normalizeServicePlan(p, idx)).filter(Boolean);

  let startingPrice = Number(rawSvc.startingPrice);
  if (isNaN(startingPrice) || startingPrice <= 0) {
    const planPrices = plans
      .map((p) => p.startingPrice)
      .filter((p) => typeof p === 'number' && p > 0);
    startingPrice = planPrices.length > 0 ? Math.min(...planPrices) : 999;
  }

  const now = new Date().toISOString();

  return {
    id,
    name,
    description,
    images,
    startingPrice,
    plans,
    createdAt: rawSvc.createdAt || now,
    updatedAt: rawSvc.updatedAt || now,
  };
}

export const DEFAULT_SERVICES_DATA = Object.values(CURATED_MENU_DATA).map((cat, idx) => normalizeService(cat, idx));
