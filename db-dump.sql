-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Фев 25 2022 г., 15:41
-- Версия сервера: 5.7.21-20-beget-5.7.21-20-1-log
-- Версия PHP: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `bgpkmaw7_suslidb`
--

-- --------------------------------------------------------

--
-- Структура таблицы `classroom`
--
-- Создание: Май 13 2021 г., 05:27
--

DROP TABLE IF EXISTS `classroom`;
CREATE TABLE `classroom` (
  `classId` int(11) NOT NULL,
  `classNumber` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `classroom`
--

INSERT INTO `classroom` (`classId`, `classNumber`) VALUES
(1, '9м'),
(2, '53м'),
(3, '52м'),
(4, '40'),
(5, '41'),
(6, '30'),
(7, '36');

-- --------------------------------------------------------

--
-- Структура таблицы `grp`
--
-- Создание: Май 13 2021 г., 05:32
--

DROP TABLE IF EXISTS `grp`;
CREATE TABLE `grp` (
  `grpId` int(11) NOT NULL,
  `grpNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `grp`
--

INSERT INTO `grp` (`grpId`, `grpNumber`) VALUES
(5, 483),
(6, 493),
(7, 475),
(8, 271),
(9, 583);

-- --------------------------------------------------------

--
-- Структура таблицы `lesson`
--
-- Создание: Май 13 2021 г., 06:06
--

DROP TABLE IF EXISTS `lesson`;
CREATE TABLE `lesson` (
  `lessonId` int(11) NOT NULL,
  `date` date NOT NULL,
  `lessonOrder` int(2) NOT NULL,
  `grp` int(11) NOT NULL,
  `teacher` int(11) NOT NULL,
  `subject` int(11) NOT NULL,
  `classroom` int(11) NOT NULL,
  `subgrp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `lesson`
--

INSERT INTO `lesson` (`lessonId`, `date`, `lessonOrder`, `grp`, `teacher`, `subject`, `classroom`, `subgrp`) VALUES
(2, '2021-05-14', 1, 5, 1, 2, 2, NULL),
(3, '2021-05-14', 2, 5, 3, 3, 1, NULL),
(4, '2021-05-14', 3, 5, 6, 4, 7, NULL),
(5, '2021-05-14', 4, 5, 2, 2, 6, 1),
(6, '2021-05-14', 4, 5, 4, 9, 4, 2),
(7, '2021-05-14', 1, 6, 4, 5, 5, NULL),
(8, '2021-05-14', 2, 6, 4, 5, 5, NULL),
(9, '2021-05-14', 3, 6, 3, 2, 1, NULL),
(10, '2021-05-14', 4, 6, 3, 2, 1, NULL),
(11, '2021-05-14', 1, 7, 5, 5, 7, NULL),
(12, '2021-05-14', 2, 7, 5, 5, 7, NULL),
(13, '2021-05-14', 3, 7, 1, 3, 2, 1),
(14, '2021-05-14', 3, 7, 4, 8, 1, 2),
(15, '2021-05-15', 1, 5, 6, 4, 7, NULL),
(16, '2021-05-15', 2, 5, 6, 4, 7, NULL),
(17, '2021-05-15', 3, 5, 2, 2, 6, 2),
(18, '2021-05-15', 3, 5, 3, 3, 1, 1),
(19, '2021-05-15', 3, 8, 1, 8, 6, 1),
(20, '2021-05-15', 3, 8, 5, 4, 1, 2),
(21, '2021-05-15', 4, 8, 4, 7, 5, 1),
(22, '2021-05-15', 1, 7, 1, 2, 3, NULL),
(23, '2021-05-15', 2, 7, 1, 2, 3, NULL),
(24, '2021-05-15', 3, 7, 2, 7, 6, NULL),
(25, '2021-05-15', 4, 7, 2, 7, 6, NULL),
(26, '2021-05-15', 1, 6, 6, 4, 1, NULL),
(27, '2021-05-15', 2, 6, 6, 4, 1, NULL),
(28, '2021-05-15', 4, 5, 2, 7, 3, NULL),
(29, '2021-05-16', 3, 5, 4, 3, 5, NULL),
(30, '2021-05-16', 1, 5, 2, 3, 5, NULL),
(31, '2021-05-16', 2, 5, 1, 4, 1, NULL),
(32, '2021-05-16', 4, 5, 4, 8, 1, 2),
(33, '2021-05-16', 4, 5, 3, 7, 4, 1),
(34, '2021-05-17', 1, 5, 1, 2, 2, NULL),
(35, '2021-05-17', 2, 5, 1, 2, 2, NULL),
(36, '2021-05-17', 3, 5, 4, 6, 4, 3),
(37, '2021-05-17', 3, 5, 3, 5, 2, 1),
(38, '2021-05-17', 3, 5, 2, 8, 1, 2),
(39, '2021-05-17', 4, 5, 5, 5, 7, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `subject`
--
-- Создание: Май 13 2021 г., 05:46
--

DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject` (
  `subjectID` int(11) NOT NULL,
  `subjectName` varchar(150) NOT NULL,
  `subjectShortName` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `subject`
--

INSERT INTO `subject` (`subjectID`, `subjectName`, `subjectShortName`) VALUES
(2, 'Системное программирование', 'СП'),
(3, 'Обеспечение качества функционирования Ксении Сергеевны', 'ОКФКС'),
(4, 'Физическая культура', 'Физ-ра'),
(5, 'Литература', 'Литр'),
(6, 'Композиция', 'Комп'),
(7, 'Анатомия', 'Анат'),
(8, 'Нотная грамота', 'НТ'),
(9, 'Пение', 'Пени');

-- --------------------------------------------------------

--
-- Структура таблицы `teacher`
--
-- Создание: Май 13 2021 г., 05:30
--

DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `teacherId` int(11) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Middlename` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `teacher`
--

INSERT INTO `teacher` (`teacherId`, `Surname`, `Name`, `Middlename`) VALUES
(1, 'Черничко', 'Иван', 'Сергеевич'),
(2, 'Пархатская', 'Анастасия', 'Михайловна'),
(3, 'Царева', 'Ксения', 'Сергеевна'),
(4, 'Бычковский', 'Максим', 'Андреевич'),
(5, 'Пущин', 'Владимир', 'Алексеевич'),
(6, 'Маркин', 'Юрий', 'Витальевич');

-- --------------------------------------------------------

--
-- Структура таблицы `time`
--
-- Создание: Май 27 2021 г., 08:32
--

DROP TABLE IF EXISTS `time`;
CREATE TABLE `time` (
  `lessonNumber` int(2) NOT NULL,
  `fromTime` time NOT NULL,
  `toTime` time NOT NULL,
  `break` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `time`
--

INSERT INTO `time` (`lessonNumber`, `fromTime`, `toTime`, `break`) VALUES
(1, '08:00:00', '08:45:00', 10),
(2, '09:05:00', '09:40:00', 15),
(3, '09:55:00', '10:40:00', 25),
(4, '11:05:00', '11:50:00', 25),
(5, '12:15:00', '13:00:00', 10),
(6, '13:10:00', '13:55:00', 10),
(7, '14:05:00', '14:50:00', 10),
(8, '15:00:00', '15:45:00', 10),
(9, '15:55:00', '16:40:00', 10),
(10, '16:50:00', '17:35:00', NULL);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `classroom`
--
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`classId`);

--
-- Индексы таблицы `grp`
--
ALTER TABLE `grp`
  ADD PRIMARY KEY (`grpId`);

--
-- Индексы таблицы `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`lessonId`),
  ADD KEY `subject` (`subject`),
  ADD KEY `classroom` (`classroom`),
  ADD KEY `teacher` (`teacher`),
  ADD KEY `grp` (`grp`) USING BTREE;

--
-- Индексы таблицы `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subjectID`);

--
-- Индексы таблицы `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacherId`);

--
-- Индексы таблицы `time`
--
ALTER TABLE `time`
  ADD PRIMARY KEY (`lessonNumber`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `classroom`
--
ALTER TABLE `classroom`
  MODIFY `classId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `grp`
--
ALTER TABLE `grp`
  MODIFY `grpId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `lesson`
--
ALTER TABLE `lesson`
  MODIFY `lessonId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT для таблицы `subject`
--
ALTER TABLE `subject`
  MODIFY `subjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacherId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `lesson_ibfk_1` FOREIGN KEY (`grp`) REFERENCES `grp` (`grpId`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_ibfk_2` FOREIGN KEY (`subject`) REFERENCES `subject` (`subjectID`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_ibfk_3` FOREIGN KEY (`classroom`) REFERENCES `classroom` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_ibfk_4` FOREIGN KEY (`teacher`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
