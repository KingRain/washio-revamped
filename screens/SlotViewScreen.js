import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabaseClient";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

function Header({ user }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>WASHIO</Text>
      <View style={styles.userContainer}>
        <View style={styles.userBadge}>
          <Text style={styles.smallText}>Basic</Text>
        </View>
        <TouchableOpacity>
          <Image source={{ uri: user?.photo }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const SlotViewScreen = ({ route }) => {
  const { floor, user } = route.params;
  const [selectedDate, setSelectedDate] = useState(moment().format("D"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(new Date());
  const [duration, setDuration] = useState(0.5);
  const [roomNo, setRoomNo] = useState("");
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const dates = Array.from({ length: 5 }, (_, i) =>
    moment().add(i, "days").format("D")
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const filters = [
          `name.ilike.%${user?.name || ""}%`,
          roomNo ? `roomNo.eq.${roomNo}` : null, // Only add if roomNo is valid
        ]
          .filter(Boolean) // Remove null values
          .join(",");
    
        const { data, error } = await supabase
          .from("Kalapurackal")
          .select("*")
          .eq("floorNo", floor)
          .eq("date", moment().date(selectedDate).format("YYYY-MM-DD"))
          .or(filters);
    
        if (error) {
          console.error("Error fetching data: ", error);
        } else {
          setBookings(data);
        }
      } catch (err) {
        console.error("Unexpected error: ", err);
      } finally {
        setLoading(false);
      }
    };
    


    const fetchRoomNo = async () => {
      const storedRoomNo = await AsyncStorage.getItem("roomNumber");
      if (storedRoomNo) {
        const parsedRoomNo = parseInt(storedRoomNo, 10);
        if (!isNaN(parsedRoomNo)) {
          setRoomNo(parsedRoomNo); // Set only valid numbers
        } else {
          console.error("Invalid room number in AsyncStorage.");
          setRoomNo(null); // Handle invalid room numbers gracefully
        }
      } else {
        setRoomNo(null); // Handle cases where roomNo is not stored
      }
    };
    


    fetchBookings();
    fetchRoomNo();
  }, [floor, selectedDate]);

  const handleBookingConfirmation = async () => {
    try {
      // Calculate start and end times
      const startTime = moment(selectedDate, "D")
        .startOf("day")
        .add(moment(startTimestamp).hours(), "hours")
        .add(moment(startTimestamp).minutes(), "minutes")
        .toISOString();
      const endTime = moment(startTime).add(duration, "hours").toISOString();

      //Formating the name
      const formatName = (name) => {
        return name
          .replace(/-IIITK$/, "")
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
      };
  
      // Fetch user-specific bookings for the next 5 days
      const { data: userBookings, error } = await supabase
        .from("Kalapurackal")
        .select("*")
        .or(`name.ilike.%${user?.name}%, roomNo.eq.${roomNo}`)
        .gte("date", moment().format("YYYY-MM-DD"))
        .lte("date", moment().add(5, "days").format("YYYY-MM-DD"));
      if (error) {
        console.error("Error fetching user bookings: ", error);
        return;
      }
  
      // Check if user already has 2 slots for the selected date
      const dailyBookings = userBookings.filter(
        (b) => moment(b.date).isSame(moment(selectedDate, "D"), "day")
      );
      if (dailyBookings.length >= 2) {
        alert("You can only book a maximum of 2 slots per day.");
        return;
      }
  
      // Check if user already has 3 bookings in the next 5 days
      if (userBookings.length >= 3) {
        alert("You can only have a maximum of 3 bookings in the next 5 days.");
        return;
      }
  
      // Check for conflicting slots
      const hasConflict = bookings.some(
        (booking) =>
          moment(startTime).isBefore(moment(booking.endTime)) &&
          moment(endTime).isAfter(moment(booking.startTime))
      );
  
      if (hasConflict) {
        alert("This time slot overlaps with an existing booking.");
        return;
      }
  
      if (moment(startTime).isBefore(moment())) {
        alert("Cannot book a slot before the current time.");
        return;
      }
  
      if (!roomNo || isNaN(parseInt(roomNo, 10))) {
        alert("Room number is not set or is invalid. Please update your profile.");
        return;
      }
      
      const newBooking = {
        id: Math.floor(Math.random() * 1000000),
        floorNo: parseInt(floor, 10),
        date: moment(selectedDate, "D").format("YYYY-MM-DD"),
        startTime,
        endTime,
        name: `${formatName(user?.name || "Anonymous")} (${roomNo})`,
        roomNo: parseInt(roomNo, 10), // Ensure roomNo is a valid integer
      };
      
      const { insertError } = await supabase.from("Kalapurackal").insert([newBooking]);
      if (insertError) {
        console.error("Error saving booking: ", insertError);
      }
       else {
        setBookings([...bookings, newBooking]);
        setModalVisible(false);
        ReactNativeHapticFeedback.trigger("impactHeavy", options);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  

  const renderBookingItem = ({ item }) => {
    const now = moment();
    const isActive = now.isBetween(
      moment(item.startTime),
      moment(item.endTime)
    );
    const isUpcoming = now.isBefore(moment(item.startTime));

    return (
      <View style={styles.bookingRow}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.slotText}>
          {`${moment(item.startTime).format("hh:mm A")} - ${moment(
            item.endTime
          ).format("hh:mm A")}`}
        </Text>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isActive
                ? "#5DB075"
                : isUpcoming
                ? "#FF6B6B"
                : "#808080",
            },
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#FFF", textAlign: "center" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Header user={user} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Floor {floor} Booking</Text>
          <View style={styles.mainContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {moment().date(selectedDate).format("D MMMM YYYY")}
              </Text>
              <View style={styles.dateSelector}>
                <TouchableOpacity>
                  <Icon name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {dates.map((date) => (
                  <TouchableOpacity
                    key={date}
                    onPress={() => setSelectedDate(date)}
                    style={[
                      styles.dateButton,
                      selectedDate === date && styles.selectedDate,
                    ]}
                  >
                    <Text style={styles.dateButtonText}>{date}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity>
                  <Icon name="chevron-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderTextName}>Name</Text>
              <Text style={styles.tableHeaderTextSlot}>Slot</Text>
              <Text style={styles.tableHeaderTextStatus}>Status</Text>
            </View>

            <FlatList
              data={bookings}
              renderItem={renderBookingItem}
              keyExtractor={(item) => item.id}
              style={styles.bookingList}
            />
            {/* Book Slot Button */}
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => {
                setModalVisible(true);
                ReactNativeHapticFeedback.trigger("impactLight", options);
              }}
            >
              <Icon
                name="add"
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.bookButtonText}>Book Slot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Booking for {moment().date(selectedDate).format("D dddd")}
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setTimePickerVisible(true)}
              >
                <Text style={styles.timeText}>
                  {moment(startTimestamp).format("hh:mm A")}
                </Text>
                <Icon name="time-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            {isTimePickerVisible && (
              <DateTimePicker
                value={startTimestamp}
                mode="time"
                display="clock"
                onChange={(_, date) => {
                  setTimePickerVisible(false);
                  if (date) setStartTimestamp(date);
                }}
              />
            )}
            <Text style={styles.sliderLabel}>
              Duration (in hours): {duration} Hours
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2}
              step={0.5}
              value={duration}
              onValueChange={setDuration}
              minimumTrackTintColor="#5DB075"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#5DB075"
              trackStyle={styles.sliderTrack}
              renderTrackMarkComponent={(index) => (
                <View style={styles.trackMark} />
              )}
            />
            <View style={styles.sliderMarksContainer}>
              {[0.5, 1, 1.5, 2].map((mark) => (
                <Text key={mark} style={styles.sliderMarkText}>
                  {mark}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleBookingConfirmation}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#040703",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0B0C0B",
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    borderBottomColor: "#474747",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userBadge: {
    borderWidth: 1,
    borderColor: "#EAF5E7",
    borderRadius: 4,
    padding: 5,
    marginRight: 12,
  },
  smallText: {
    fontSize: 12,
    color: "#EAF5E7",
    fontFamily: "Inter-Regular",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#040703",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "DelaGothicOne-Regular",
    color: "#EAF5E7",
    marginTop: 16,
    marginLeft: 16,
  },
  mainContainer: {
    flex: 1,
    marginTop: 20,
    borderColor: "#EAF5E7",
    borderWidth: 1,
    backgroundColor: "#040703",
    borderRadius: 4,
    padding: 4,
  },

  dateContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "DelaGothicOne-Regular",
    marginBottom: 2,
    padding: 10,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 10,
  },
  dateButton: {
    width: "auto",
    padding: 6,
  },
  selectedDate: {
    backgroundColor: "#333333",
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#FFFFFF",
    fontFamily: "DelaGothicOne-Regular",
    fontSize: 16,
  },
  tableHeader: {
    borderTopColor: "#333333",
    borderTopWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  tableHeaderTextName: {
    color: "#FFFFFF",
    fontSize: 16,
    width: "45%",
    fontFamily: "DelaGothicOne-Regular",
  },
  tableHeaderTextSlot: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 40,
    width: "20%",
    fontFamily: "DelaGothicOne-Regular",
  },
  tableHeaderTextStatus: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
    width: "25%",
    fontFamily: "DelaGothicOne-Regular",
  },
  bookingList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    flex: 2,
  },
  slotText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bookButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#5DB075",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    color: "#EAF5E7",
    marginBottom: 18,
    fontFamily: "DelaGothicOne-Regular",
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#5DB075",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
  sliderLabel: {
    color: "#EAF5E7",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Inter-Bold",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeLabel: {
    color: "#EAF5E7",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 30,
  },
  timeText: {
    color: "#EAF5E7",
    marginRight: 10,
    fontFamily: "Inter-Regular",
  },
  sliderTrack: {
    height: 10,
  },
  trackMark: {
    width: 2,
    height: 10,
    backgroundColor: "#FFF",
  },
  sliderMarksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -15,
    marginBottom: 40,
  },
  sliderMarkText: {
    color: "#EAF5E7",
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
});

export default SlotViewScreen;
