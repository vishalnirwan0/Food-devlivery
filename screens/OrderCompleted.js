import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { Divider } from "react-native-elements";
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore"
import db from "../firebase";
import MenuItems from "../components/restaurantDetail/MenuItems";
import Maps from "../components/FinishOrder/Maps"
import BottomTabs from "../components/home/BottomTabs";
import OrderSratus from "../components/FinishOrder/Orderstatus";
import OrderInfo from "../components/FinishOrder/OrderInfo";

export default function OrderCompleted({navigation}) {
  const [lastOrder, setLastOrder] = useState({
    items: [
      { },
    ],
  });

  const { items, restaurantName } = useSelector(
    (state) => state.cartReducer.selectedItems
  );

  const total = items
    .map((item) => Number(item.foodPrice.replace("£", "")))
    .reduce((prev, curr) => prev + curr, 0);

  const totalGBP = total.toLocaleString("en", {
    style: "currency",
    currency: "GBP",
  });

  useEffect(() => {
    // const db = getFirestore(firebase);
    // const collectionRef = collection(db, "orders");
      // const unsubscribe = getDocs(collectionRef)
      // .orderBy("createdAt", "desc")
      // .limit(1)
      // .onSnapshot((snapshot) => {
      //   snapshot.docs.map((doc) => {
      //     setLastOrder(doc.data());
      //   });
      // });

      const unsubscribe = onSnapshot(
            query(
              collection(db, "orders"),
              orderBy("createdAt"),
              // limit(1)
              ),
              (snapshot) => {
        snapshot.docs.map((doc) => setLastOrder(doc.data()));
              })
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* green checkmark */}
      <View>
        <BottomTabs navigation={navigation}/>
        <Divider width={1} />
        <View><OrderSratus/></View>
        
        <ScrollView>
        <OrderInfo/>
          <MenuItems
            foods={lastOrder.items}
            hideCheckbox={true}
            marginLeft={10}
          />
          <LottieView
            style={{ height: 200, alignSelf: "center" }}
            source={require("../assets/animations/cooking.json")}
            // autoPlay
            speed={0.5}
          />
        </ScrollView>
      </View>
      
    </SafeAreaView>
  );
}   