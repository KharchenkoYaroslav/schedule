import { GroupSchedule, TeacherSchedule, GroupPair, TeacherPair } from "./structure";

class ScheduleManager {
  groupSchedules: { [key: string]: { schedule: GroupSchedule, lastUpdate: string } };
  teacherSchedules: { [key: string]: { schedule: TeacherSchedule, lastUpdate: string }};

  constructor(data?: { groupSchedules: { [key: string]: { schedule: GroupSchedule, lastUpdate: string } }, teacherSchedules: { [key: string]: { schedule: TeacherSchedule, lastUpdate: string } } }) {
      this.groupSchedules = data?.groupSchedules || {};
      this.teacherSchedules = data?.teacherSchedules || {};
  }

  // Додавання або оновлення розкладу групи
  addOrUpdateGroupSchedule(find: string, schedule: GroupSchedule, lastUpdate: string) {
      this.groupSchedules[find] = { schedule, lastUpdate };
  }

  // Додавання або оновлення розкладу вчителя
  addOrUpdateTeacherSchedule(find: string, schedule: TeacherSchedule, lastUpdate: string) {
      this.teacherSchedules[find] = { schedule, lastUpdate };
  }

  // Видалення розкладу групи
  removeGroupSchedule(find: string) {
      delete this.groupSchedules[find];
  }

  // Видалення розкладу вчителя
  removeTeacherSchedule(find: string) {
      delete this.teacherSchedules[find];
  }

  // Отримання розкладу групи
  getGroupSchedule(find: string): GroupSchedule | null {
      return this.groupSchedules[find]?.schedule || null;
  }

  // Отримання розкладу вчителя
  getTeacherSchedule(find: string): TeacherSchedule | null {
      return this.teacherSchedules[find]?.schedule || null;
  }

  // Перевірка останнього оновлення для групи
  isGroupScheduleUpToDate(find: string, serverLastUpdate: string): boolean {
      return this.groupSchedules[find]?.lastUpdate === serverLastUpdate;
  }

  // Перевірка останнього оновлення для вчителя
  isTeacherScheduleUpToDate(find: string, serverLastUpdate: string): boolean {
      return this.teacherSchedules[find]?.lastUpdate === serverLastUpdate;
  }

  // Серіалізація даних
  serialize(): string {
      const serializedGroupSchedules = Object.entries(this.groupSchedules).reduce((acc, [key, { schedule, lastUpdate }]) => {
          acc[key] = {
              schedule: this.serializeSchedule(schedule),
              lastUpdate
          };
          return acc;
      }, {} as { [key: string]: { schedule: any, lastUpdate: string } });

      const serializedTeacherSchedules = Object.entries(this.teacherSchedules).reduce((acc, [key, { schedule, lastUpdate }]) => {
          acc[key] = {
              schedule: this.serializeSchedule(schedule),
              lastUpdate
          };
          return acc;
      }, {} as { [key: string]: { schedule: any, lastUpdate: string } });

      return JSON.stringify({
          groupSchedules: serializedGroupSchedules,
          teacherSchedules: serializedTeacherSchedules
      });
  }

  // Десеріалізація даних
  static deserialize(data: string): ScheduleManager {
      const parsedData = JSON.parse(data);

      const deserializedGroupSchedules = Object.entries(parsedData.groupSchedules).reduce((acc, [key, value]) => {
          const typedValue = value as { schedule: any, lastUpdate: string };
          acc[key] = {
              schedule: this.deserializeSchedule(typedValue.schedule) as GroupSchedule,
              lastUpdate: typedValue.lastUpdate
          };
          return acc;
      }, {} as { [key: string]: { schedule: GroupSchedule, lastUpdate: string } });

      const deserializedTeacherSchedules = Object.entries(parsedData.teacherSchedules).reduce((acc, [key, value]) => {
          const typedValue = value as { schedule: any, lastUpdate: string };
          acc[key] = {
              schedule: this.deserializeSchedule(typedValue.schedule) as TeacherSchedule,
              lastUpdate: typedValue.lastUpdate
          };
          return acc;
      }, {} as { [key: string]: { schedule: TeacherSchedule, lastUpdate: string } });

      return new ScheduleManager({
          groupSchedules: deserializedGroupSchedules,
          teacherSchedules: deserializedTeacherSchedules
      });
  }

  private serializeSchedule(schedule: GroupSchedule | TeacherSchedule): any {
      return {
          week_1: schedule.week_1?.map(day => ({
              dayOfWeek: day.dayOfWeek,
              pairs: day.pairs.map(pair => pair?.serialize())
          })),
          week_2: schedule.week_2?.map(day => ({
              dayOfWeek: day.dayOfWeek,
              pairs: day.pairs.map(pair => pair?.serialize())
          })),
          ...('groupName' in schedule ? { groupName: schedule.groupName } : { name: schedule.name })
      };
  }

  private static deserializeSchedule(data: any): GroupSchedule | TeacherSchedule {
      const week_1 = data.week_1?.map((day: any) => ({
          dayOfWeek: day.dayOfWeek,
          pairs: day.pairs.map((pair: any) => pair ? (pair.teacher ? GroupPair.deserialize(pair) : TeacherPair.deserialize(pair)) : null)
      }));

      const week_2 = data.week_2?.map((day: any) => ({
          dayOfWeek: day.dayOfWeek,
          pairs: day.pairs.map((pair: any) => pair ? (pair.teacher ? GroupPair.deserialize(pair) : TeacherPair.deserialize(pair)) : null)
      }));

      if (data.groupName) {
          return {
              week_1,
              week_2,
              groupName: data.groupName
          } as GroupSchedule;
      } else {
          return {
              week_1,
              week_2,
              name: data.name
          } as TeacherSchedule;
      }
  }
}

export default ScheduleManager;