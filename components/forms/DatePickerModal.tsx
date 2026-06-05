import {
  View, Text, TouchableOpacity, Modal, Pressable,
  FlatList, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const CELL_SIZE = 36;
const GRID_WIDTH = CELL_SIZE * 7;
const TODAY = new Date();
const YEAR_RANGE = Array.from({ length: 21 }, (_, i) => TODAY.getFullYear() - 10 + i);

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  /** Allow selecting future dates. Defaults to true. */
  allowFuture?: boolean;
}

interface PortalDropdownProps {
  label: string;
  items: { label: string; value: number; disabled?: boolean }[];
  selected: number;
  onSelect: (value: number) => void;
  textColor: string;
  primaryColor: string;
  cardBg: string;
  borderColor: string;
  mutedColor: string;
}

function PortalDropdown({
  label, items, selected, onSelect,
  textColor, primaryColor, cardBg, borderColor, mutedColor,
}: PortalDropdownProps) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const triggerRef = useRef<View>(null);
  const { width: screenW } = useWindowDimensions();

  const DROPDOWN_W = 130;
  const DROPDOWN_H = 220;

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  };

  const left = Math.min(anchor.x, screenW - DROPDOWN_W - 8);

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        onPress={openDropdown}
        hitSlop={6}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: open ? rgba(primaryColor, 0.1) : 'transparent',
        }}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>{label}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={13}
          color={mutedColor}
          style={{ marginTop: 1 }}
        />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={{ flex: 1 }}>
          <View style={{
            position: 'absolute',
            top: anchor.y + anchor.h + 4,
            left,
            width: DROPDOWN_W,
            height: DROPDOWN_H,
            backgroundColor: cardBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 14,
            elevation: 20,
            overflow: 'hidden',
          }}>
            <FlatList
              data={items}
              keyExtractor={item => String(item.value)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
              getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
              initialScrollIndex={Math.max(0, items.findIndex(i => i.value === selected) - 2)}
              renderItem={({ item }) => {
                const isActive = item.value === selected;
                return (
                  <TouchableOpacity
                    onPress={() => { if (!item.disabled) { onSelect(item.value); setOpen(false); } }}
                    activeOpacity={item.disabled ? 1 : 0.7}
                    style={{
                      height: 40,
                      paddingHorizontal: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isActive ? rgba(primaryColor, 0.1) : 'transparent',
                      opacity: item.disabled ? 0.35 : 1,
                    }}>
                    <Text style={{
                      color: isActive ? primaryColor : textColor,
                      fontSize: 14,
                      fontWeight: isActive ? '600' : '400',
                    }}>
                      {item.label}
                    </Text>
                    {isActive && <Ionicons name="checkmark" size={13} color={primaryColor} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function DatePickerModal({
  visible, date, onSelect, onClose, allowFuture = true,
}: DatePickerModalProps) {
  const { textColor, mutedColor, primaryColor, cardBg, borderColor } = useThemeColors();

  const year = date.getFullYear();
  const month = date.getMonth();

  const todayY = TODAY.getFullYear();
  const todayM = TODAY.getMonth();
  const todayD = TODAY.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const clampDay = (y: number, m: number) =>
    Math.min(date.getDate(), new Date(y, m + 1, 0).getDate());

  // When allowFuture=false, clamp navigation to current month
  const isFutureMonth = (y: number, m: number) =>
    y > todayY || (y === todayY && m > todayM);

  // Simpler: just check if next month is future
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const canGoNextMonth = allowFuture || !isFutureMonth(nextYear, nextMonth);

  const setMonth = (m: number) => {
    if (!allowFuture && isFutureMonth(year, m)) return;
    onSelect(new Date(year, m, clampDay(year, m)));
  };
  const setYear = (y: number) => {
    if (!allowFuture && y > todayY) return;
    // if new year + current month is future, clamp to current month
    const clampedMonth = (!allowFuture && isFutureMonth(y, month)) ? todayM : month;
    onSelect(new Date(y, clampedMonth, clampDay(y, clampedMonth)));
  };

  const handleDayPress = (day: number) => {
    if (!allowFuture && new Date(year, month, day) > TODAY) return;
    onSelect(new Date(year, month, day));
    onClose();
  };

  const goToToday = () => { onSelect(new Date(todayY, todayM, todayD)); onClose(); };

  const monthItems = MONTHS_FULL.map((label, i) => ({
    label,
    value: i,
    disabled: !allowFuture && isFutureMonth(year, i),
  }));

  const yearItems = YEAR_RANGE.map(y => ({
    label: String(y),
    value: y,
    disabled: !allowFuture && y > todayY,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}>
        <Pressable onPress={() => { }}>
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 24,
            borderWidth: 1,
            borderColor,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 16,
          }}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => onSelect(new Date(year, month - 1, 1))} hitSlop={8}>
                <Ionicons name="chevron-back" size={20} color={textColor} />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <PortalDropdown
                  label={MONTHS[month]}
                  items={monthItems}
                  selected={month}
                  onSelect={setMonth}
                  textColor={textColor}
                  primaryColor={primaryColor}
                  cardBg={cardBg}
                  borderColor={borderColor}
                  mutedColor={mutedColor}
                />
                <PortalDropdown
                  label={String(year)}
                  items={yearItems}
                  selected={year}
                  onSelect={setYear}
                  textColor={textColor}
                  primaryColor={primaryColor}
                  cardBg={cardBg}
                  borderColor={borderColor}
                  mutedColor={mutedColor}
                />
              </View>

              <TouchableOpacity
                onPress={() => canGoNextMonth && onSelect(new Date(nextYear, nextMonth, 1))}
                hitSlop={8}
                style={{ opacity: canGoNextMonth ? 1 : 0.3 }}
                disabled={!canGoNextMonth}>
                <Ionicons name="chevron-forward" size={20} color={textColor} />
              </TouchableOpacity>
            </View>

            {/* Weekday labels */}
            <View style={{ flexDirection: 'row', width: GRID_WIDTH, marginBottom: 4 }}>
              {WEEKDAYS.map((d, i) => (
                <View key={i} style={{ width: CELL_SIZE, height: CELL_SIZE, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600' }}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Day grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: GRID_WIDTH }}>
              {cells.map((day, i) => {
                if (day === null) return <View key={`e-${i}`} style={{ width: CELL_SIZE, height: CELL_SIZE }} />;

                const isToday = day === todayD && month === todayM && year === todayY;
                const isSelected = day === date.getDate() && month === date.getMonth() && year === date.getFullYear();
                const isFuture = !allowFuture && new Date(year, month, day) > TODAY;

                return (
                  <TouchableOpacity
                    key={`d-${day}`}
                    onPress={() => handleDayPress(day)}
                    activeOpacity={isFuture ? 1 : 0.7}
                    disabled={isFuture}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isFuture ? 0.3 : 1,
                    }}>
                    {(isSelected || isToday) && !isFuture && (
                      <View style={{
                        position: 'absolute',
                        width: CELL_SIZE - 4,
                        height: CELL_SIZE - 4,
                        borderRadius: (CELL_SIZE - 4) / 2,
                        backgroundColor: isSelected ? primaryColor : rgba(primaryColor, 0.15),
                      }} />
                    )}
                    <Text style={{
                      color: isSelected && !isFuture ? '#fff' : isToday ? primaryColor : textColor,
                      fontSize: 14,
                      fontWeight: isSelected || isToday ? '700' : '400',
                    }}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Today shortcut */}
            <TouchableOpacity
              onPress={goToToday}
              style={{
                alignSelf: 'center',
                marginTop: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: rgba(primaryColor, 0.1),
              }}>
              <Text style={{ color: primaryColor, fontSize: 13, fontWeight: '600' }}>Today</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
