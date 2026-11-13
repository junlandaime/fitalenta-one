var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import express from "express";
import path9 from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

// src/routes/index.ts
import { Router as Router30 } from "express";

// src/routes/auth.routes.ts
import { Router } from "express";

// src/config/prisma.ts
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "mysql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "mysql"\n}\n\nenum Role {\n  superadmin\n  admin\n  editor\n  user\n}\n\nenum ProgramStatus {\n  active\n  inactive\n  full\n}\n\nenum Gender {\n  L\n  P\n}\n\nenum RegistrationStatus {\n  menunggu\n  lolos\n  tidak_lolos\n}\n\nenum PlacementStage {\n  proses\n  lolos\n  ditempatkan\n}\n\nenum PaymentMethod {\n  transfer\n  cash\n  credit_card\n}\n\nenum PaymentStatus {\n  pending\n  installment_1\n  installment_2\n  installment_3\n  installment_4\n  installment_5\n  installment_6\n  paid\n  overdue\n  cancelled\n}\n\nenum NotificationType {\n  info\n  warning\n  success\n  error\n}\n\nenum RelatedEntity {\n  registration\n  payment\n  selection\n  placement\n}\n\nenum TeamMemberType {\n  expert\n  team\n}\n\nmodel User {\n  id              Int       @id @default(autoincrement())\n  email           String    @unique\n  password        String\n  name            String\n  phone           String?\n  address         String?   @db.Text\n  birthPlace      String?   @map("birth_place")\n  birthDate       DateTime? @map("birth_date") @db.Date\n  role            Role      @default(user)\n  emailVerifiedAt DateTime? @map("email_verified_at")\n  createdAt       DateTime  @default(now()) @map("created_at")\n  updatedAt       DateTime  @updatedAt @map("updated_at")\n\n  articles                  Article[]\n  registrations             Registration[]\n  registrationStatusChanges RegistrationStatusHistory[]\n  selectionEvaluations      SelectionStatus[]           @relation("SelectionEvaluatedBy")\n  paymentsVerified          Payment[]                   @relation("PaymentVerifiedBy")\n  paymentHistoryChanges     PaymentHistory[]            @relation("PaymentHistoryChangedBy")\n  notifications             Notification[]\n\n  @@map("users")\n}\n\nmodel Category {\n  id        Int        @id @default(autoincrement())\n  name      String\n  slug      String     @unique\n  parentId  Int?       @map("parent_id")\n  parent    Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])\n  children  Category[] @relation("CategoryToCategory")\n  createdAt DateTime   @default(now()) @map("created_at")\n  updatedAt DateTime   @updatedAt @map("updated_at")\n\n  events    Event[]\n  articles  Article[]\n  galleries Gallery[]\n\n  @@map("categories")\n}\n\nmodel Event {\n  id              Int      @id @default(autoincrement())\n  title           String\n  slug            String   @unique\n  description     String   @db.Text\n  eventDate       DateTime @map("event_date")\n  location        String\n  isFeatured      Boolean  @default(false) @map("is_featured")\n  maxParticipants Int?     @map("max_participants")\n  link            String?\n  image           String?\n  categoryId      Int      @map("category_id")\n  category        Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  views           Int      @default(0)\n  createdAt       DateTime @default(now()) @map("created_at")\n  updatedAt       DateTime @updatedAt @map("updated_at")\n\n  eventViews EventView[]\n\n  @@map("events")\n}\n\nmodel EventView {\n  id        Int      @id @default(autoincrement())\n  eventId   Int      @map("event_id")\n  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  ipAddress String   @map("ip_address")\n  userAgent String   @map("user_agent") @db.Text\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("event_views")\n}\n\nmodel Article {\n  id         Int       @id @default(autoincrement())\n  title      String\n  slug       String    @unique\n  content    String    @db.Text\n  excerpt    String    @db.Text\n  authorId   Int       @map("author_id")\n  author     User      @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  eventDate  DateTime? @map("event_date")\n  isFeatured Boolean   @default(false) @map("is_featured")\n  image      String?\n  categoryId Int       @default(2) @map("category_id")\n  category   Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  views      Int       @default(0)\n  createdAt  DateTime  @default(now()) @map("created_at")\n  updatedAt  DateTime  @updatedAt @map("updated_at")\n\n  articleViews ArticleView[]\n\n  @@map("articles")\n}\n\nmodel ArticleView {\n  id        Int      @id @default(autoincrement())\n  articleId Int      @map("article_id")\n  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)\n  ipAddress String   @map("ip_address")\n  userAgent String   @map("user_agent") @db.Text\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("article_views")\n}\n\nmodel Service {\n  id         Int      @id @default(autoincrement())\n  slug       String   @unique\n  title      String\n  icon       String?\n  summary    String   @db.Text\n  content    Json\n  views      Int      @default(0)\n  isFeatured Boolean  @default(false) @map("is_featured")\n  createdAt  DateTime @default(now()) @map("created_at")\n  updatedAt  DateTime @updatedAt @map("updated_at")\n\n  serviceViews ServiceView[]\n\n  @@map("services")\n}\n\nmodel ServiceView {\n  id        Int      @id @default(autoincrement())\n  serviceId Int      @map("service_id")\n  service   Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n  ipAddress String   @map("ip_address")\n  userAgent String   @map("user_agent") @db.Text\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("service_views")\n}\n\nmodel Gallery {\n  id          Int       @id @default(autoincrement())\n  title       String\n  description String?   @db.Text\n  image       String\n  categoryId  Int       @map("category_id")\n  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  isFeatured  Boolean   @default(false) @map("is_featured")\n  eventDate   DateTime? @map("event_date")\n  order       Int       @default(0)\n  createdAt   DateTime  @default(now()) @map("created_at")\n  updatedAt   DateTime  @updatedAt @map("updated_at")\n\n  @@map("galleries")\n}\n\nmodel TeamMember {\n  id        Int            @id @default(autoincrement())\n  type      TeamMemberType @default(expert)\n  name      String\n  position  String\n  bio       String?        @db.Text\n  image     String?\n  order     Int            @default(0)\n  isActive  Boolean        @default(true) @map("is_active")\n  createdAt DateTime       @default(now()) @map("created_at")\n  updatedAt DateTime       @updatedAt @map("updated_at")\n\n  @@index([type, isActive, order])\n  @@map("team_members")\n}\n\nmodel Testimonial {\n  id         Int      @id @default(autoincrement())\n  clientName String   @map("client_name")\n  company    String\n  content    String   @db.Text\n  rating     Int      @default(5)\n  image      String?\n  isFeatured Boolean  @default(false) @map("is_featured")\n  createdAt  DateTime @default(now()) @map("created_at")\n  updatedAt  DateTime @updatedAt @map("updated_at")\n\n  @@map("testimonials")\n}\n\nmodel ProgramCategory {\n  id          Int      @id @default(autoincrement())\n  name        String\n  description String?  @db.Text\n  createdAt   DateTime @default(now()) @map("created_at")\n\n  programs Program[]\n\n  @@map("program_categories")\n}\n\nmodel Program {\n  id                   Int              @id @default(autoincrement())\n  categoryId           Int?             @map("category_id")\n  category             ProgramCategory? @relation(fields: [categoryId], references: [id])\n  name                 String\n  programFormat        String?          @map("program_format")\n  description          String?          @db.Text\n  requirements         String?          @db.Text\n  schedule             String?          @db.Text\n  duration             String?\n  capacity             Int?\n  currentParticipants  Int              @default(0) @map("current_participants")\n  status               ProgramStatus    @default(active)\n  isRunning            Boolean          @default(false) @map("is_running")\n  contactInfo          String?          @map("contact_info") @db.Text\n  registrationDeadline DateTime?        @map("registration_deadline") @db.Date\n  startDate            DateTime?        @map("start_date") @db.Date\n  endDate              DateTime?        @map("end_date") @db.Date\n  location             String?          @default("Jakarta, Indonesia & Jepang")\n  trainingCost         Decimal          @default(16000000.00) @map("training_cost") @db.Decimal(10, 2)\n  trainingFeeDetails   String?          @map("training_fee_details") @db.Text\n  departureCost        Decimal          @default(30000000.00) @map("departure_cost") @db.Decimal(10, 2)\n  departureFeeDetails  String?          @map("departure_fee_details") @db.Text\n  installmentPlan      String?          @default("none") @map("installment_plan")\n  downPayment          Decimal          @default(0.00) @map("down_payment") @db.Decimal(10, 2)\n  jobMatchingCost      Decimal          @default(0.00) @map("job_matching_cost") @db.Decimal(10, 2)\n  bridgeFund           String?          @default("Tersedia") @map("bridge_fund")\n  timelineText         String?          @map("timeline_text") @db.Text\n  requirementsText     String?          @map("requirements_text") @db.Text\n  sortOrder            Int              @default(999) @map("sort_order")\n  createdAt            DateTime         @default(now()) @map("created_at")\n  updatedAt            DateTime         @updatedAt @map("updated_at")\n\n  registrations Registration[]\n\n  @@map("programs")\n}\n\nmodel Registration {\n  id                   Int                @id @default(autoincrement())\n  userId               Int?               @map("user_id")\n  user                 User?              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  programId            Int?               @map("program_id")\n  program              Program?           @relation(fields: [programId], references: [id], onDelete: Cascade)\n  registrationStatus   RegistrationStatus @default(menunggu) @map("registration_status")\n  registrationCode     String             @unique @map("registration_code")\n  selectionNotes       String?            @map("selection_notes") @db.Text\n  registrationDate     DateTime           @default(now()) @map("registration_date")\n  updatedAt            DateTime           @updatedAt @map("updated_at")\n  nik                  String?            @db.VarChar(20)\n  gender               Gender?\n  birthPlace           String?            @map("birth_place")\n  birthDate            DateTime?          @map("birth_date") @db.Date\n  lastEducation        String?            @map("last_education")\n  major                String?\n  educationInstitution String?            @map("education_institution")\n  currentActivity      String?            @map("current_activity")\n  maritalStatus        String?            @map("marital_status")\n  parentPhone          String?            @map("parent_phone")\n  parentRelationship   String?            @map("parent_relationship")\n  ktpProvinceCode      String?            @map("ktp_province_code")\n  ktpProvinceName      String?            @map("ktp_province_name")\n  ktpCityCode          String?            @map("ktp_city_code")\n  ktpCityName          String?            @map("ktp_city_name")\n  ktpAddress           String?            @map("ktp_address") @db.Text\n  domicileProvinceCode String?            @map("domicile_province_code")\n  domicileProvinceName String?            @map("domicile_province_name")\n  domicileCityCode     String?            @map("domicile_city_code")\n  domicileCityName     String?            @map("domicile_city_name")\n  domicileAddress      String?            @map("domicile_address") @db.Text\n  photoPath            String?            @map("photo_path")\n  n4CertificatePath    String?            @map("n4_certificate_path")\n  sswCertificatePath   String?            @map("ssw_certificate_path")\n\n  statusHistory     RegistrationStatusHistory[]\n  selectionStatuses SelectionStatus[]\n  placementStatuses PlacementStatus[]\n  payments          Payment[]\n\n  @@unique([userId, programId], name: "unique_user_program")\n  @@map("registrations")\n}\n\nmodel RegistrationStatusHistory {\n  id             Int                 @id @default(autoincrement())\n  registrationId Int?                @map("registration_id")\n  registration   Registration?       @relation(fields: [registrationId], references: [id], onDelete: Cascade)\n  oldStatus      RegistrationStatus? @map("old_status")\n  newStatus      RegistrationStatus? @map("new_status")\n  notes          String?             @db.Text\n  changedBy      Int?                @map("changed_by")\n  changedByUser  User?               @relation(fields: [changedBy], references: [id])\n  changedAt      DateTime            @default(now()) @map("changed_at")\n\n  @@map("registration_status_history")\n}\n\nmodel SelectionStatus {\n  id              Int                @id @default(autoincrement())\n  registrationId  Int?               @map("registration_id")\n  registration    Registration?      @relation(fields: [registrationId], references: [id], onDelete: Cascade)\n  status          RegistrationStatus @default(menunggu)\n  notes           String?            @db.Text\n  evaluatedBy     Int?               @map("evaluated_by")\n  evaluatedByUser User?              @relation("SelectionEvaluatedBy", fields: [evaluatedBy], references: [id])\n  evaluatedAt     DateTime?          @map("evaluated_at")\n  createdAt       DateTime           @default(now()) @map("created_at")\n  updatedAt       DateTime           @updatedAt @map("updated_at")\n\n  @@map("selection_status")\n}\n\nmodel PlacementStatus {\n  id             Int            @id @default(autoincrement())\n  registrationId Int?           @map("registration_id")\n  registration   Registration?  @relation(fields: [registrationId], references: [id], onDelete: Cascade)\n  companyName    String?        @map("company_name")\n  status         PlacementStage @default(proses)\n  placementDate  DateTime?      @map("placement_date") @db.Date\n  notes          String?        @db.Text\n  createdAt      DateTime       @default(now()) @map("created_at")\n  updatedAt      DateTime       @updatedAt @map("updated_at")\n\n  @@map("placement_status")\n}\n\nmodel Payment {\n  id                       Int           @id @default(autoincrement())\n  registrationId           Int?          @map("registration_id")\n  registration             Registration? @relation(fields: [registrationId], references: [id], onDelete: Cascade)\n  invoiceNumber            String        @unique @map("invoice_number")\n  amount                   Decimal       @db.Decimal(15, 2)\n  amountPaid               Decimal       @default(0.00) @map("amount_paid") @db.Decimal(15, 2)\n  paymentMethod            PaymentMethod @default(transfer) @map("payment_method")\n  bankName                 String?       @map("bank_name")\n  accountNumber            String?       @map("account_number")\n  status                   PaymentStatus @default(pending)\n  dueDate                  DateTime?     @map("due_date") @db.Date\n  proofImage               String?       @map("proof_image")\n  paymentDate              DateTime?     @map("payment_date")\n  verifiedBy               Int?          @map("verified_by")\n  verifiedByUser           User?         @relation("PaymentVerifiedBy", fields: [verifiedBy], references: [id])\n  verifiedAt               DateTime?     @map("verified_at")\n  receiptNumber            String?       @unique @map("receipt_number")\n  notes                    String?       @db.Text\n  createdAt                DateTime      @default(now()) @map("created_at")\n  updatedAt                DateTime      @updatedAt @map("updated_at")\n  isManualInvoice          Boolean       @default(false) @map("is_manual_invoice")\n  installmentAmounts       Json?         @map("installment_amounts")\n  currentInstallmentNumber Int           @default(0) @map("current_installment_number")\n  nextDueDate              DateTime?     @map("next_due_date") @db.Date\n  issuedAt                 DateTime?     @map("issued_at")\n\n  paymentHistory PaymentHistory[]\n\n  @@map("payments")\n}\n\nmodel PaymentHistory {\n  id            Int            @id @default(autoincrement())\n  paymentId     Int?           @map("payment_id")\n  payment       Payment?       @relation(fields: [paymentId], references: [id], onDelete: Cascade)\n  oldStatus     PaymentStatus? @map("old_status")\n  newStatus     PaymentStatus? @map("new_status")\n  amountChanged Decimal?       @map("amount_changed") @db.Decimal(10, 2)\n  notes         String?        @db.Text\n  changedBy     Int?           @map("changed_by")\n  changedByUser User?          @relation("PaymentHistoryChangedBy", fields: [changedBy], references: [id])\n  changedAt     DateTime       @default(now()) @map("changed_at")\n  oldAmountPaid Decimal?       @map("old_amount_paid") @db.Decimal(15, 2)\n  newAmountPaid Decimal?       @map("new_amount_paid") @db.Decimal(15, 2)\n\n  @@map("payment_history")\n}\n\nmodel Notification {\n  id              Int              @id @default(autoincrement())\n  userId          Int?             @map("user_id")\n  user            User?            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  title           String\n  message         String           @db.Text\n  type            NotificationType @default(info)\n  isRead          Boolean          @default(false) @map("is_read")\n  relatedEntity   RelatedEntity?   @map("related_entity")\n  relatedEntityId Int?             @map("related_entity_id")\n  createdAt       DateTime         @default(now()) @map("created_at")\n\n  @@map("notifications")\n}\n\nmodel ContactMessage {\n  id        Int      @id @default(autoincrement())\n  name      String\n  email     String\n  subject   String\n  message   String   @db.Text\n  phone     String?\n  company   String?\n  isRead    Boolean  @default(false) @map("is_read")\n  createdAt DateTime @default(now()) @map("created_at")\n\n  @@map("contact_messages")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"birthPlace","kind":"scalar","type":"String","dbName":"birth_place"},{"name":"birthDate","kind":"scalar","type":"DateTime","dbName":"birth_date"},{"name":"role","kind":"enum","type":"Role"},{"name":"emailVerifiedAt","kind":"scalar","type":"DateTime","dbName":"email_verified_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"articles","kind":"object","type":"Article","relationName":"ArticleToUser"},{"name":"registrations","kind":"object","type":"Registration","relationName":"RegistrationToUser"},{"name":"registrationStatusChanges","kind":"object","type":"RegistrationStatusHistory","relationName":"RegistrationStatusHistoryToUser"},{"name":"selectionEvaluations","kind":"object","type":"SelectionStatus","relationName":"SelectionEvaluatedBy"},{"name":"paymentsVerified","kind":"object","type":"Payment","relationName":"PaymentVerifiedBy"},{"name":"paymentHistoryChanges","kind":"object","type":"PaymentHistory","relationName":"PaymentHistoryChangedBy"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"}],"dbName":"users","schema":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"Int","dbName":"parent_id"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryToCategory"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryToCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"events","kind":"object","type":"Event","relationName":"CategoryToEvent"},{"name":"articles","kind":"object","type":"Article","relationName":"ArticleToCategory"},{"name":"galleries","kind":"object","type":"Gallery","relationName":"CategoryToGallery"}],"dbName":"categories","schema":null},"Event":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"eventDate","kind":"scalar","type":"DateTime","dbName":"event_date"},{"name":"location","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean","dbName":"is_featured"},{"name":"maxParticipants","kind":"scalar","type":"Int","dbName":"max_participants"},{"name":"link","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToEvent"},{"name":"views","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"eventViews","kind":"object","type":"EventView","relationName":"EventToEventView"}],"dbName":"events","schema":null},"EventView":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"eventId","kind":"scalar","type":"Int","dbName":"event_id"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventView"},{"name":"ipAddress","kind":"scalar","type":"String","dbName":"ip_address"},{"name":"userAgent","kind":"scalar","type":"String","dbName":"user_agent"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"event_views","schema":null},"Article":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"Int","dbName":"author_id"},{"name":"author","kind":"object","type":"User","relationName":"ArticleToUser"},{"name":"eventDate","kind":"scalar","type":"DateTime","dbName":"event_date"},{"name":"isFeatured","kind":"scalar","type":"Boolean","dbName":"is_featured"},{"name":"image","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"category","kind":"object","type":"Category","relationName":"ArticleToCategory"},{"name":"views","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"articleViews","kind":"object","type":"ArticleView","relationName":"ArticleToArticleView"}],"dbName":"articles","schema":null},"ArticleView":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"articleId","kind":"scalar","type":"Int","dbName":"article_id"},{"name":"article","kind":"object","type":"Article","relationName":"ArticleToArticleView"},{"name":"ipAddress","kind":"scalar","type":"String","dbName":"ip_address"},{"name":"userAgent","kind":"scalar","type":"String","dbName":"user_agent"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"article_views","schema":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"slug","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"views","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean","dbName":"is_featured"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"serviceViews","kind":"object","type":"ServiceView","relationName":"ServiceToServiceView"}],"dbName":"services","schema":null},"ServiceView":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"serviceId","kind":"scalar","type":"Int","dbName":"service_id"},{"name":"service","kind":"object","type":"Service","relationName":"ServiceToServiceView"},{"name":"ipAddress","kind":"scalar","type":"String","dbName":"ip_address"},{"name":"userAgent","kind":"scalar","type":"String","dbName":"user_agent"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"service_views","schema":null},"Gallery":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToGallery"},{"name":"isFeatured","kind":"scalar","type":"Boolean","dbName":"is_featured"},{"name":"eventDate","kind":"scalar","type":"DateTime","dbName":"event_date"},{"name":"order","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"galleries","schema":null},"TeamMember":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"type","kind":"enum","type":"TeamMemberType"},{"name":"name","kind":"scalar","type":"String"},{"name":"position","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"team_members","schema":null},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"clientName","kind":"scalar","type":"String","dbName":"client_name"},{"name":"company","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean","dbName":"is_featured"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"testimonials","schema":null},"ProgramCategory":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"programs","kind":"object","type":"Program","relationName":"ProgramToProgramCategory"}],"dbName":"program_categories","schema":null},"Program":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"category","kind":"object","type":"ProgramCategory","relationName":"ProgramToProgramCategory"},{"name":"name","kind":"scalar","type":"String"},{"name":"programFormat","kind":"scalar","type":"String","dbName":"program_format"},{"name":"description","kind":"scalar","type":"String"},{"name":"requirements","kind":"scalar","type":"String"},{"name":"schedule","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"currentParticipants","kind":"scalar","type":"Int","dbName":"current_participants"},{"name":"status","kind":"enum","type":"ProgramStatus"},{"name":"isRunning","kind":"scalar","type":"Boolean","dbName":"is_running"},{"name":"contactInfo","kind":"scalar","type":"String","dbName":"contact_info"},{"name":"registrationDeadline","kind":"scalar","type":"DateTime","dbName":"registration_deadline"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"location","kind":"scalar","type":"String"},{"name":"trainingCost","kind":"scalar","type":"Decimal","dbName":"training_cost"},{"name":"trainingFeeDetails","kind":"scalar","type":"String","dbName":"training_fee_details"},{"name":"departureCost","kind":"scalar","type":"Decimal","dbName":"departure_cost"},{"name":"departureFeeDetails","kind":"scalar","type":"String","dbName":"departure_fee_details"},{"name":"installmentPlan","kind":"scalar","type":"String","dbName":"installment_plan"},{"name":"downPayment","kind":"scalar","type":"Decimal","dbName":"down_payment"},{"name":"jobMatchingCost","kind":"scalar","type":"Decimal","dbName":"job_matching_cost"},{"name":"bridgeFund","kind":"scalar","type":"String","dbName":"bridge_fund"},{"name":"timelineText","kind":"scalar","type":"String","dbName":"timeline_text"},{"name":"requirementsText","kind":"scalar","type":"String","dbName":"requirements_text"},{"name":"sortOrder","kind":"scalar","type":"Int","dbName":"sort_order"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"registrations","kind":"object","type":"Registration","relationName":"ProgramToRegistration"}],"dbName":"programs","schema":null},"Registration":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"user","kind":"object","type":"User","relationName":"RegistrationToUser"},{"name":"programId","kind":"scalar","type":"Int","dbName":"program_id"},{"name":"program","kind":"object","type":"Program","relationName":"ProgramToRegistration"},{"name":"registrationStatus","kind":"enum","type":"RegistrationStatus","dbName":"registration_status"},{"name":"registrationCode","kind":"scalar","type":"String","dbName":"registration_code"},{"name":"selectionNotes","kind":"scalar","type":"String","dbName":"selection_notes"},{"name":"registrationDate","kind":"scalar","type":"DateTime","dbName":"registration_date"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"nik","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"birthPlace","kind":"scalar","type":"String","dbName":"birth_place"},{"name":"birthDate","kind":"scalar","type":"DateTime","dbName":"birth_date"},{"name":"lastEducation","kind":"scalar","type":"String","dbName":"last_education"},{"name":"major","kind":"scalar","type":"String"},{"name":"educationInstitution","kind":"scalar","type":"String","dbName":"education_institution"},{"name":"currentActivity","kind":"scalar","type":"String","dbName":"current_activity"},{"name":"maritalStatus","kind":"scalar","type":"String","dbName":"marital_status"},{"name":"parentPhone","kind":"scalar","type":"String","dbName":"parent_phone"},{"name":"parentRelationship","kind":"scalar","type":"String","dbName":"parent_relationship"},{"name":"ktpProvinceCode","kind":"scalar","type":"String","dbName":"ktp_province_code"},{"name":"ktpProvinceName","kind":"scalar","type":"String","dbName":"ktp_province_name"},{"name":"ktpCityCode","kind":"scalar","type":"String","dbName":"ktp_city_code"},{"name":"ktpCityName","kind":"scalar","type":"String","dbName":"ktp_city_name"},{"name":"ktpAddress","kind":"scalar","type":"String","dbName":"ktp_address"},{"name":"domicileProvinceCode","kind":"scalar","type":"String","dbName":"domicile_province_code"},{"name":"domicileProvinceName","kind":"scalar","type":"String","dbName":"domicile_province_name"},{"name":"domicileCityCode","kind":"scalar","type":"String","dbName":"domicile_city_code"},{"name":"domicileCityName","kind":"scalar","type":"String","dbName":"domicile_city_name"},{"name":"domicileAddress","kind":"scalar","type":"String","dbName":"domicile_address"},{"name":"photoPath","kind":"scalar","type":"String","dbName":"photo_path"},{"name":"n4CertificatePath","kind":"scalar","type":"String","dbName":"n4_certificate_path"},{"name":"sswCertificatePath","kind":"scalar","type":"String","dbName":"ssw_certificate_path"},{"name":"statusHistory","kind":"object","type":"RegistrationStatusHistory","relationName":"RegistrationToRegistrationStatusHistory"},{"name":"selectionStatuses","kind":"object","type":"SelectionStatus","relationName":"RegistrationToSelectionStatus"},{"name":"placementStatuses","kind":"object","type":"PlacementStatus","relationName":"PlacementStatusToRegistration"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToRegistration"}],"dbName":"registrations","schema":null},"RegistrationStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"registrationId","kind":"scalar","type":"Int","dbName":"registration_id"},{"name":"registration","kind":"object","type":"Registration","relationName":"RegistrationToRegistrationStatusHistory"},{"name":"oldStatus","kind":"enum","type":"RegistrationStatus","dbName":"old_status"},{"name":"newStatus","kind":"enum","type":"RegistrationStatus","dbName":"new_status"},{"name":"notes","kind":"scalar","type":"String"},{"name":"changedBy","kind":"scalar","type":"Int","dbName":"changed_by"},{"name":"changedByUser","kind":"object","type":"User","relationName":"RegistrationStatusHistoryToUser"},{"name":"changedAt","kind":"scalar","type":"DateTime","dbName":"changed_at"}],"dbName":"registration_status_history","schema":null},"SelectionStatus":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"registrationId","kind":"scalar","type":"Int","dbName":"registration_id"},{"name":"registration","kind":"object","type":"Registration","relationName":"RegistrationToSelectionStatus"},{"name":"status","kind":"enum","type":"RegistrationStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"evaluatedBy","kind":"scalar","type":"Int","dbName":"evaluated_by"},{"name":"evaluatedByUser","kind":"object","type":"User","relationName":"SelectionEvaluatedBy"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime","dbName":"evaluated_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"selection_status","schema":null},"PlacementStatus":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"registrationId","kind":"scalar","type":"Int","dbName":"registration_id"},{"name":"registration","kind":"object","type":"Registration","relationName":"PlacementStatusToRegistration"},{"name":"companyName","kind":"scalar","type":"String","dbName":"company_name"},{"name":"status","kind":"enum","type":"PlacementStage"},{"name":"placementDate","kind":"scalar","type":"DateTime","dbName":"placement_date"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"}],"dbName":"placement_status","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"registrationId","kind":"scalar","type":"Int","dbName":"registration_id"},{"name":"registration","kind":"object","type":"Registration","relationName":"PaymentToRegistration"},{"name":"invoiceNumber","kind":"scalar","type":"String","dbName":"invoice_number"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"amountPaid","kind":"scalar","type":"Decimal","dbName":"amount_paid"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod","dbName":"payment_method"},{"name":"bankName","kind":"scalar","type":"String","dbName":"bank_name"},{"name":"accountNumber","kind":"scalar","type":"String","dbName":"account_number"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"dueDate","kind":"scalar","type":"DateTime","dbName":"due_date"},{"name":"proofImage","kind":"scalar","type":"String","dbName":"proof_image"},{"name":"paymentDate","kind":"scalar","type":"DateTime","dbName":"payment_date"},{"name":"verifiedBy","kind":"scalar","type":"Int","dbName":"verified_by"},{"name":"verifiedByUser","kind":"object","type":"User","relationName":"PaymentVerifiedBy"},{"name":"verifiedAt","kind":"scalar","type":"DateTime","dbName":"verified_at"},{"name":"receiptNumber","kind":"scalar","type":"String","dbName":"receipt_number"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"isManualInvoice","kind":"scalar","type":"Boolean","dbName":"is_manual_invoice"},{"name":"installmentAmounts","kind":"scalar","type":"Json","dbName":"installment_amounts"},{"name":"currentInstallmentNumber","kind":"scalar","type":"Int","dbName":"current_installment_number"},{"name":"nextDueDate","kind":"scalar","type":"DateTime","dbName":"next_due_date"},{"name":"issuedAt","kind":"scalar","type":"DateTime","dbName":"issued_at"},{"name":"paymentHistory","kind":"object","type":"PaymentHistory","relationName":"PaymentToPaymentHistory"}],"dbName":"payments","schema":null},"PaymentHistory":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"paymentId","kind":"scalar","type":"Int","dbName":"payment_id"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToPaymentHistory"},{"name":"oldStatus","kind":"enum","type":"PaymentStatus","dbName":"old_status"},{"name":"newStatus","kind":"enum","type":"PaymentStatus","dbName":"new_status"},{"name":"amountChanged","kind":"scalar","type":"Decimal","dbName":"amount_changed"},{"name":"notes","kind":"scalar","type":"String"},{"name":"changedBy","kind":"scalar","type":"Int","dbName":"changed_by"},{"name":"changedByUser","kind":"object","type":"User","relationName":"PaymentHistoryChangedBy"},{"name":"changedAt","kind":"scalar","type":"DateTime","dbName":"changed_at"},{"name":"oldAmountPaid","kind":"scalar","type":"Decimal","dbName":"old_amount_paid"},{"name":"newAmountPaid","kind":"scalar","type":"Decimal","dbName":"new_amount_paid"}],"dbName":"payment_history","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean","dbName":"is_read"},{"name":"relatedEntity","kind":"enum","type":"RelatedEntity","dbName":"related_entity"},{"name":"relatedEntityId","kind":"scalar","type":"Int","dbName":"related_entity_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"}],"dbName":"notifications","schema":null},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"company","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean","dbName":"is_read"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"}],"dbName":"contact_messages","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","author","parent","children","category","event","eventViews","_count","events","articles","galleries","article","articleViews","user","programs","registrations","program","registration","changedByUser","statusHistory","evaluatedByUser","selectionStatuses","placementStatuses","verifiedByUser","payment","paymentHistory","payments","registrationStatusChanges","selectionEvaluations","paymentsVerified","paymentHistoryChanges","notifications","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.updateOne","User.updateMany","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_avg","_sum","_min","_max","User.groupBy","User.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.updateOne","Category.updateMany","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Event.findUnique","Event.findUniqueOrThrow","Event.findFirst","Event.findFirstOrThrow","Event.findMany","Event.createOne","Event.createMany","Event.updateOne","Event.updateMany","Event.upsertOne","Event.deleteOne","Event.deleteMany","Event.groupBy","Event.aggregate","EventView.findUnique","EventView.findUniqueOrThrow","EventView.findFirst","EventView.findFirstOrThrow","EventView.findMany","EventView.createOne","EventView.createMany","EventView.updateOne","EventView.updateMany","EventView.upsertOne","EventView.deleteOne","EventView.deleteMany","EventView.groupBy","EventView.aggregate","Article.findUnique","Article.findUniqueOrThrow","Article.findFirst","Article.findFirstOrThrow","Article.findMany","Article.createOne","Article.createMany","Article.updateOne","Article.updateMany","Article.upsertOne","Article.deleteOne","Article.deleteMany","Article.groupBy","Article.aggregate","ArticleView.findUnique","ArticleView.findUniqueOrThrow","ArticleView.findFirst","ArticleView.findFirstOrThrow","ArticleView.findMany","ArticleView.createOne","ArticleView.createMany","ArticleView.updateOne","ArticleView.updateMany","ArticleView.upsertOne","ArticleView.deleteOne","ArticleView.deleteMany","ArticleView.groupBy","ArticleView.aggregate","service","serviceViews","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.updateOne","Service.updateMany","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","ServiceView.findUnique","ServiceView.findUniqueOrThrow","ServiceView.findFirst","ServiceView.findFirstOrThrow","ServiceView.findMany","ServiceView.createOne","ServiceView.createMany","ServiceView.updateOne","ServiceView.updateMany","ServiceView.upsertOne","ServiceView.deleteOne","ServiceView.deleteMany","ServiceView.groupBy","ServiceView.aggregate","Gallery.findUnique","Gallery.findUniqueOrThrow","Gallery.findFirst","Gallery.findFirstOrThrow","Gallery.findMany","Gallery.createOne","Gallery.createMany","Gallery.updateOne","Gallery.updateMany","Gallery.upsertOne","Gallery.deleteOne","Gallery.deleteMany","Gallery.groupBy","Gallery.aggregate","TeamMember.findUnique","TeamMember.findUniqueOrThrow","TeamMember.findFirst","TeamMember.findFirstOrThrow","TeamMember.findMany","TeamMember.createOne","TeamMember.createMany","TeamMember.updateOne","TeamMember.updateMany","TeamMember.upsertOne","TeamMember.deleteOne","TeamMember.deleteMany","TeamMember.groupBy","TeamMember.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.updateOne","Testimonial.updateMany","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","ProgramCategory.findUnique","ProgramCategory.findUniqueOrThrow","ProgramCategory.findFirst","ProgramCategory.findFirstOrThrow","ProgramCategory.findMany","ProgramCategory.createOne","ProgramCategory.createMany","ProgramCategory.updateOne","ProgramCategory.updateMany","ProgramCategory.upsertOne","ProgramCategory.deleteOne","ProgramCategory.deleteMany","ProgramCategory.groupBy","ProgramCategory.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.updateOne","Program.updateMany","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Registration.findUnique","Registration.findUniqueOrThrow","Registration.findFirst","Registration.findFirstOrThrow","Registration.findMany","Registration.createOne","Registration.createMany","Registration.updateOne","Registration.updateMany","Registration.upsertOne","Registration.deleteOne","Registration.deleteMany","Registration.groupBy","Registration.aggregate","RegistrationStatusHistory.findUnique","RegistrationStatusHistory.findUniqueOrThrow","RegistrationStatusHistory.findFirst","RegistrationStatusHistory.findFirstOrThrow","RegistrationStatusHistory.findMany","RegistrationStatusHistory.createOne","RegistrationStatusHistory.createMany","RegistrationStatusHistory.updateOne","RegistrationStatusHistory.updateMany","RegistrationStatusHistory.upsertOne","RegistrationStatusHistory.deleteOne","RegistrationStatusHistory.deleteMany","RegistrationStatusHistory.groupBy","RegistrationStatusHistory.aggregate","SelectionStatus.findUnique","SelectionStatus.findUniqueOrThrow","SelectionStatus.findFirst","SelectionStatus.findFirstOrThrow","SelectionStatus.findMany","SelectionStatus.createOne","SelectionStatus.createMany","SelectionStatus.updateOne","SelectionStatus.updateMany","SelectionStatus.upsertOne","SelectionStatus.deleteOne","SelectionStatus.deleteMany","SelectionStatus.groupBy","SelectionStatus.aggregate","PlacementStatus.findUnique","PlacementStatus.findUniqueOrThrow","PlacementStatus.findFirst","PlacementStatus.findFirstOrThrow","PlacementStatus.findMany","PlacementStatus.createOne","PlacementStatus.createMany","PlacementStatus.updateOne","PlacementStatus.updateMany","PlacementStatus.upsertOne","PlacementStatus.deleteOne","PlacementStatus.deleteMany","PlacementStatus.groupBy","PlacementStatus.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.updateOne","Payment.updateMany","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentHistory.findUnique","PaymentHistory.findUniqueOrThrow","PaymentHistory.findFirst","PaymentHistory.findFirstOrThrow","PaymentHistory.findMany","PaymentHistory.createOne","PaymentHistory.createMany","PaymentHistory.updateOne","PaymentHistory.updateMany","PaymentHistory.upsertOne","PaymentHistory.deleteOne","PaymentHistory.deleteMany","PaymentHistory.groupBy","PaymentHistory.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.updateOne","Notification.updateMany","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","AND","OR","NOT","id","name","email","subject","message","phone","company","isRead","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","search","userId","title","NotificationType","type","RelatedEntity","relatedEntity","relatedEntityId","paymentId","PaymentStatus","oldStatus","newStatus","amountChanged","notes","changedBy","changedAt","oldAmountPaid","newAmountPaid","registrationId","invoiceNumber","amount","amountPaid","PaymentMethod","paymentMethod","bankName","accountNumber","status","dueDate","proofImage","paymentDate","verifiedBy","verifiedAt","receiptNumber","updatedAt","isManualInvoice","installmentAmounts","currentInstallmentNumber","nextDueDate","issuedAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","companyName","PlacementStage","placementDate","RegistrationStatus","evaluatedBy","evaluatedAt","programId","registrationStatus","registrationCode","selectionNotes","registrationDate","nik","Gender","gender","birthPlace","birthDate","lastEducation","major","educationInstitution","currentActivity","maritalStatus","parentPhone","parentRelationship","ktpProvinceCode","ktpProvinceName","ktpCityCode","ktpCityName","ktpAddress","domicileProvinceCode","domicileProvinceName","domicileCityCode","domicileCityName","domicileAddress","photoPath","n4CertificatePath","sswCertificatePath","categoryId","programFormat","description","requirements","schedule","duration","capacity","currentParticipants","ProgramStatus","isRunning","contactInfo","registrationDeadline","startDate","endDate","location","trainingCost","trainingFeeDetails","departureCost","departureFeeDetails","installmentPlan","downPayment","jobMatchingCost","bridgeFund","timelineText","requirementsText","sortOrder","every","some","none","clientName","content","rating","image","isFeatured","TeamMemberType","position","bio","order","isActive","eventDate","serviceId","ipAddress","userAgent","slug","icon","summary","views","articleId","excerpt","authorId","eventId","maxParticipants","link","parentId","password","address","Role","role","emailVerifiedAt","unique_user_program","is","isNot","_relevance","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "pAqyAaYCFgsAAKMFACARAACgBQAgHQAApAUAIB4AAKUFACAfAACmBQAgIAAAlgUAICEAAKcFACDSAgAAoQUAMNMCAAAnABDUAgAAoQUAMNUCAgAAAAHWAgEAsAQAIdcCAQAAAAHaAgEAsQQAId0CQACzBAAhigNAALMEACGkAwEAsQQAIaUDQACTBQAh8AMBALAEACHxAwEAsQQAIfMDAACiBfMDIvQDQACTBQAhAQAAAAEAIBMDAAC7BQAgBgAAsAUAIA4AALwFACDSAgAAugUAMNMCAAADABDUAgAAugUAMNUCAgCvBAAh3QJAALMEACHrAgEAsAQAIYoDQACzBAAhugMCAK8EACHYAwEAsAQAIdoDAQCxBAAh2wMgALIEACHhA0AAkwUAIeUDAQCwBAAh6AMCAK8EACHqAwEAsAQAIesDAgCvBAAhBgMAAIsJACAGAACbCQAgDgAApQkAINoDAAC9BQAg4QMAAL0FACD4AwAApgkAIBMDAAC7BQAgBgAAsAUAIA4AALwFACDSAgAAugUAMNMCAAADABDUAgAAugUAMNUCAgAAAAHdAkAAswQAIesCAQCwBAAhigNAALMEACG6AwIArwQAIdgDAQCwBAAh2gMBALEEACHbAyAAsgQAIeEDQACTBQAh5QMBAAAAAegDAgCvBAAh6gMBALAEACHrAwIArwQAIQMAAAADACABAAAEADACAAAFACAOBAAAtgUAIAUAALcFACAKAAC4BQAgCwAAowUAIAwAALkFACDSAgAAtQUAMNMCAAAHABDUAgAAtQUAMNUCAgCvBAAh1gIBALAEACHdAkAAswQAIYoDQACzBAAh5QMBALAEACHvAwIAhwUAIQEAAAAHACAHBAAAmwkAIAUAAKEJACAKAACiCQAgCwAAgwkAIAwAAKMJACDvAwAAvQUAIPgDAACkCQAgDgQAALYFACAFAAC3BQAgCgAAuAUAIAsAAKMFACAMAAC5BQAg0gIAALUFADDTAgAABwAQ1AIAALUFADDVAgIAAAAB1gIBALAEACHdAkAAswQAIYoDQACzBAAh5QMBAAAAAe8DAgCHBQAhAwAAAAcAIAEAAAkAMAIAAAoAIBMGAACwBQAgCAAAtAUAINICAACzBQAw0wIAAAwAENQCAACzBQAw1QICAK8EACHdAkAAswQAIesCAQCwBAAhigNAALMEACG6AwIArwQAIbwDAQCwBAAhyAMBALAEACHaAwEAsQQAIdsDIACyBAAh4QNAALMEACHlAwEAsAQAIegDAgCvBAAh7QMCAIcFACHuAwEAsQQAIQYGAACbCQAgCAAAnwkAINoDAAC9BQAg7QMAAL0FACDuAwAAvQUAIPgDAACgCQAgEwYAALAFACAIAAC0BQAg0gIAALMFADDTAgAADAAQ1AIAALMFADDVAgIAAAAB3QJAALMEACHrAgEAsAQAIYoDQACzBAAhugMCAK8EACG8AwEAsAQAIcgDAQCwBAAh2gMBALEEACHbAyAAsgQAIeEDQACzBAAh5QMBAAAAAegDAgCvBAAh7QMCAIcFACHuAwEAsQQAIQMAAAAMACABAAANADACAAAOACAKBwAAsgUAINICAACxBQAw0wIAABAAENQCAACxBQAw1QICAK8EACHdAkAAswQAIYoDQACzBAAh4wMBALAEACHkAwEAsAQAIewDAgCvBAAhAgcAAJ0JACD4AwAAngkAIAoHAACyBQAg0gIAALEFADDTAgAAEAAQ1AIAALEFADDVAgIAAAAB3QJAALMEACGKA0AAswQAIeMDAQCwBAAh5AMBALAEACHsAwIArwQAIQMAAAAQACABAAARADACAAASACABAAAAEAAgAwAAAAMAIAEAAAQAMAIAAAUAIA4GAACwBQAg0gIAAK8FADDTAgAAFgAQ1AIAAK8FADDVAgIArwQAId0CQACzBAAh6wIBALAEACGKA0AAswQAIboDAgCvBAAhvAMBALEEACHaAwEAsAQAIdsDIACyBAAh3wMCAK8EACHhA0AAkwUAIQQGAACbCQAgvAMAAL0FACDhAwAAvQUAIPgDAACcCQAgDgYAALAFACDSAgAArwUAMNMCAAAWABDUAgAArwUAMNUCAgAAAAHdAkAAswQAIesCAQCwBAAhigNAALMEACG6AwIArwQAIbwDAQCxBAAh2gMBALAEACHbAyAAsgQAId8DAgCvBAAh4QNAAJMFACEDAAAAFgAgAQAAFwAwAgAAGAAgAQAAAAcAIAEAAAAMACABAAAAAwAgAQAAABYAIAoNAACuBQAg0gIAAK0FADDTAgAAHgAQ1AIAAK0FADDVAgIArwQAId0CQACzBAAhigNAALMEACHjAwEAsAQAIeQDAQCwBAAh6QMCAK8EACECDQAAmQkAIPgDAACaCQAgCg0AAK4FACDSAgAArQUAMNMCAAAeABDUAgAArQUAMNUCAgAAAAHdAkAAswQAIYoDQACzBAAh4wMBALAEACHkAwEAsAQAIekDAgCvBAAhAwAAAB4AIAEAAB8AMAIAACAAIAEAAAAeACApDwAAigUAIBIAAKsFACAVAACkBQAgFwAApQUAIBgAAKwFACAcAACmBQAg0gIAAKkFADDTAgAAIwAQ1AIAAKkFADDVAgIArwQAIeoCAgCHBQAhigNAALMEACGcAwIAhwUAIZ0DAACaBZoDIp4DAQCwBAAhnwMBALEEACGgA0AAswQAIaEDAQCxBAAhowMAAKoFowMjpAMBALEEACGlA0AAkwUAIaYDAQCxBAAhpwMBALEEACGoAwEAsQQAIakDAQCxBAAhqgMBALEEACGrAwEAsQQAIawDAQCxBAAhrQMBALEEACGuAwEAsQQAIa8DAQCxBAAhsAMBALEEACGxAwEAsQQAIbIDAQCxBAAhswMBALEEACG0AwEAsQQAIbUDAQCxBAAhtgMBALEEACG3AwEAsQQAIbgDAQCxBAAhuQMBALEEACEiDwAAiwkAIBIAAJYJACAVAACFCQAgFwAAhgkAIBgAAJcJACAcAACHCQAg6gIAAL0FACCcAwAAvQUAIJ8DAAC9BQAgoQMAAL0FACCjAwAAvQUAIKQDAAC9BQAgpQMAAL0FACCmAwAAvQUAIKcDAAC9BQAgqAMAAL0FACCpAwAAvQUAIKoDAAC9BQAgqwMAAL0FACCsAwAAvQUAIK0DAAC9BQAgrgMAAL0FACCvAwAAvQUAILADAAC9BQAgsQMAAL0FACCyAwAAvQUAILMDAAC9BQAgtAMAAL0FACC1AwAAvQUAILYDAAC9BQAgtwMAAL0FACC4AwAAvQUAILkDAAC9BQAg-AMAAJgJACAqDwAAigUAIBIAAKsFACAVAACkBQAgFwAApQUAIBgAAKwFACAcAACmBQAg0gIAAKkFADDTAgAAIwAQ1AIAAKkFADDVAgIAAAAB6gICAIcFACGKA0AAswQAIZwDAgCHBQAhnQMAAJoFmgMingMBAAAAAZ8DAQCxBAAhoANAALMEACGhAwEAsQQAIaMDAACqBaMDI6QDAQCxBAAhpQNAAJMFACGmAwEAsQQAIacDAQCxBAAhqAMBALEEACGpAwEAsQQAIaoDAQCxBAAhqwMBALEEACGsAwEAsQQAIa0DAQCxBAAhrgMBALEEACGvAwEAsQQAIbADAQCxBAAhsQMBALEEACGyAwEAsQQAIbMDAQCxBAAhtAMBALEEACG1AwEAsQQAIbYDAQCxBAAhtwMBALEEACG4AwEAsQQAIbkDAQCxBAAh9QMAAKgFACADAAAAIwAgAQAAJAAwAgAAJQAgFgsAAKMFACARAACgBQAgHQAApAUAIB4AAKUFACAfAACmBQAgIAAAlgUAICEAAKcFACDSAgAAoQUAMNMCAAAnABDUAgAAoQUAMNUCAgCvBAAh1gIBALAEACHXAgEAsAQAIdoCAQCxBAAh3QJAALMEACGKA0AAswQAIaQDAQCxBAAhpQNAAJMFACHwAwEAsAQAIfEDAQCxBAAh8wMAAKIF8wMi9ANAAJMFACEBAAAAJwAgIwYAAJ8FACARAACgBQAg0gIAAJ0FADDTAgAAKQAQ1AIAAJ0FADDVAgIArwQAIdYCAQCwBAAh3QJAALMEACGDAwAAngXDAyKKA0AAswQAIboDAgCHBQAhuwMBALEEACG8AwEAsQQAIb0DAQCxBAAhvgMBALEEACG_AwEAsQQAIcADAgCHBQAhwQMCAK8EACHDAyAAsgQAIcQDAQCxBAAhxQNAAJMFACHGA0AAkwUAIccDQACTBQAhyAMBALEEACHJAxAAkAUAIcoDAQCxBAAhywMQAJAFACHMAwEAsQQAIc0DAQCxBAAhzgMQAJAFACHPAxAAkAUAIdADAQCxBAAh0QMBALEEACHSAwEAsQQAIdMDAgCvBAAhAQAAACkAIAgQAADqBAAg0gIAAOkEADDTAgAAKwAQ1AIAAOkEADDVAgIArwQAIdYCAQCwBAAh3QJAALMEACG8AwEAsQQAIQEAAAArACAVBgAAlAkAIBEAAIQJACC6AwAAvQUAILsDAAC9BQAgvAMAAL0FACC9AwAAvQUAIL4DAAC9BQAgvwMAAL0FACDAAwAAvQUAIMQDAAC9BQAgxQMAAL0FACDGAwAAvQUAIMcDAAC9BQAgyAMAAL0FACDKAwAAvQUAIMwDAAC9BQAgzQMAAL0FACDQAwAAvQUAINEDAAC9BQAg0gMAAL0FACD4AwAAlQkAICMGAACfBQAgEQAAoAUAINICAACdBQAw0wIAACkAENQCAACdBQAw1QICAAAAAdYCAQCwBAAh3QJAALMEACGDAwAAngXDAyKKA0AAswQAIboDAgCHBQAhuwMBALEEACG8AwEAsQQAIb0DAQCxBAAhvgMBALEEACG_AwEAsQQAIcADAgCHBQAhwQMCAK8EACHDAyAAsgQAIcQDAQCxBAAhxQNAAJMFACHGA0AAkwUAIccDQACTBQAhyAMBALEEACHJAxAAkAUAIcoDAQCxBAAhywMQAJAFACHMAwEAsQQAIc0DAQCxBAAhzgMQAJAFACHPAxAAkAUAIdADAQCxBAAh0QMBALEEACHSAwEAsQQAIdMDAgCvBAAhAwAAACkAIAEAAC0AMAIAAC4AIAEAAAApACADAAAAIwAgAQAAJAAwAgAAJQAgAQAAACMAIAwTAACVBQAgFAAAigUAINICAACbBQAw0wIAADMAENQCAACbBQAw1QICAK8EACHzAgAAnAWaAyP0AgAAnAWaAyP2AgEAsQQAIfcCAgCHBQAh-AJAALMEACH7AgIAhwUAIQgTAACPCQAgFAAAiwkAIPMCAAC9BQAg9AIAAL0FACD2AgAAvQUAIPcCAAC9BQAg-wIAAL0FACD4AwAAkwkAIAwTAACVBQAgFAAAigUAINICAACbBQAw0wIAADMAENQCAACbBQAw1QICAAAAAfMCAACcBZoDI_QCAACcBZoDI_YCAQCxBAAh9wICAIcFACH4AkAAswQAIfsCAgCHBQAhAwAAADMAIAEAADQAMAIAADUAIAEAAAAjACABAAAAJwAgDRMAAJUFACAWAACKBQAg0gIAAJkFADDTAgAAOQAQ1AIAAJkFADDVAgIArwQAId0CQACzBAAh9gIBALEEACH7AgIAhwUAIYMDAACaBZoDIooDQACzBAAhmgMCAIcFACGbA0AAkwUAIQcTAACPCQAgFgAAiwkAIPYCAAC9BQAg-wIAAL0FACCaAwAAvQUAIJsDAAC9BQAg-AMAAJIJACANEwAAlQUAIBYAAIoFACDSAgAAmQUAMNMCAAA5ABDUAgAAmQUAMNUCAgAAAAHdAkAAswQAIfYCAQCxBAAh-wICAIcFACGDAwAAmgWaAyKKA0AAswQAIZoDAgCHBQAhmwNAAJMFACEDAAAAOQAgAQAAOgAwAgAAOwAgAQAAACMAIAEAAAAnACAMEwAAlQUAINICAACXBQAw0wIAAD8AENQCAACXBQAw1QICAK8EACHdAkAAswQAIfYCAQCxBAAh-wICAIcFACGDAwAAmAWYAyKKA0AAswQAIZYDAQCxBAAhmANAAJMFACEGEwAAjwkAIPYCAAC9BQAg-wIAAL0FACCWAwAAvQUAIJgDAAC9BQAg-AMAAJEJACAMEwAAlQUAINICAACXBQAw0wIAAD8AENQCAACXBQAw1QICAAAAAd0CQACzBAAh9gIBALEEACH7AgIAhwUAIYMDAACYBZgDIooDQACzBAAhlgMBALEEACGYA0AAkwUAIQMAAAA_ACABAABAADACAABBACABAAAAIwAgHRMAAJUFACAZAACKBQAgGwAAlgUAINICAACPBQAw0wIAAEQAENQCAACPBQAw1QICAK8EACHdAkAAswQAIfYCAQCxBAAh-wICAIcFACH8AgEAsAQAIf0CEACQBQAh_gIQAJAFACGAAwAAkQWAAyKBAwEAsQQAIYIDAQCxBAAhgwMAAJIF8wIihANAAJMFACGFAwEAsQQAIYYDQACTBQAhhwMCAIcFACGIA0AAkwUAIYkDAQCxBAAhigNAALMEACGLAyAAsgQAIYwDAACUBQAgjQMCAK8EACGOA0AAkwUAIY8DQACTBQAhERMAAI8JACAZAACLCQAgGwAAiAkAIPYCAAC9BQAg-wIAAL0FACCBAwAAvQUAIIIDAAC9BQAghAMAAL0FACCFAwAAvQUAIIYDAAC9BQAghwMAAL0FACCIAwAAvQUAIIkDAAC9BQAgjAMAAL0FACCOAwAAvQUAII8DAAC9BQAg-AMAAJAJACAdEwAAlQUAIBkAAIoFACAbAACWBQAg0gIAAI8FADDTAgAARAAQ1AIAAI8FADDVAgIAAAAB3QJAALMEACH2AgEAsQQAIfsCAgCHBQAh_AIBAAAAAf0CEACQBQAh_gIQAJAFACGAAwAAkQWAAyKBAwEAsQQAIYIDAQCxBAAhgwMAAJIF8wIihANAAJMFACGFAwEAsQQAIYYDQACTBQAhhwMCAIcFACGIA0AAkwUAIYkDAQAAAAGKA0AAswQAIYsDIACyBAAhjAMAAJQFACCNAwIArwQAIY4DQACTBQAhjwNAAJMFACEDAAAARAAgAQAARQAwAgAARgAgAQAAACMAIAEAAAAnACAPFAAAigUAIBoAAI4FACDSAgAAiwUAMNMCAABKABDUAgAAiwUAMNUCAgCvBAAh8QICAIcFACHzAgAAjAXzAiP0AgAAjAXzAiP1AhAAjQUAIfYCAQCxBAAh9wICAIcFACH4AkAAswQAIfkCEACNBQAh-gIQAI0FACELFAAAiwkAIBoAAI0JACDxAgAAvQUAIPMCAAC9BQAg9AIAAL0FACD1AgAAvQUAIPYCAAC9BQAg9wIAAL0FACD5AgAAvQUAIPoCAAC9BQAg-AMAAI4JACAPFAAAigUAIBoAAI4FACDSAgAAiwUAMNMCAABKABDUAgAAiwUAMNUCAgAAAAHxAgIAhwUAIfMCAACMBfMCI_QCAACMBfMCI_UCEACNBQAh9gIBALEEACH3AgIAhwUAIfgCQACzBAAh-QIQAI0FACH6AhAAjQUAIQMAAABKACABAABLADACAABMACABAAAARAAgAQAAACcAIAEAAABKACABAAAAMwAgAQAAADkAIAEAAAA_ACABAAAARAAgAwAAADMAIAEAADQAMAIAADUAIAMAAAA5ACABAAA6ADACAAA7ACADAAAARAAgAQAARQAwAgAARgAgAwAAAEoAIAEAAEsAMAIAAEwAIA0PAACKBQAg0gIAAIYFADDTAgAAWQAQ1AIAAIYFADDVAgIArwQAIdkCAQCwBAAh3AIgALIEACHdAkAAswQAIeoCAgCHBQAh6wIBALAEACHtAgAAiAXtAiLvAgAAiQXvAiPwAgIAhwUAIQUPAACLCQAg6gIAAL0FACDvAgAAvQUAIPACAAC9BQAg-AMAAIwJACANDwAAigUAINICAACGBQAw0wIAAFkAENQCAACGBQAw1QICAAAAAdkCAQCwBAAh3AIgALIEACHdAkAAswQAIeoCAgCHBQAh6wIBALAEACHtAgAAiAXtAiLvAgAAiQXvAiPwAgIAhwUAIQMAAABZACABAABaADACAABbACABAAAAJwAgAQAAAAMAIAEAAAAjACABAAAAMwAgAQAAADkAIAEAAABEACABAAAASgAgAQAAAFkAIAEAAAABACANCwAAgwkAIBEAAIQJACAdAACFCQAgHgAAhgkAIB8AAIcJACAgAACICQAgIQAAiQkAINoCAAC9BQAgpAMAAL0FACClAwAAvQUAIPEDAAC9BQAg9AMAAL0FACD4AwAAigkAIAMAAAAnACABAABmADACAAABACADAAAAJwAgAQAAZgAwAgAAAQAgAwAAACcAIAEAAGYAMAIAAAEAIBMLAAD8CAAgEQAA_QgAIB0AAP4IACAeAAD_CAAgHwAAgAkAICAAAIEJACAhAACCCQAg1QICAAAAAdYCAQAAAAHXAgEAAAAB2gIBAAAAAd0CQAAAAAGKA0AAAAABpAMBAAAAAaUDQAAAAAHwAwEAAAAB8QMBAAAAAfMDAAAA8wMC9ANAAAAAAQEnAABqACAM1QICAAAAAdYCAQAAAAHXAgEAAAAB2gIBAAAAAd0CQAAAAAGKA0AAAAABpAMBAAAAAaUDQAAAAAHwAwEAAAAB8QMBAAAAAfMDAAAA8wMC9ANAAAAAAQEnAABsADATCwAAswgAIBEAALQIACAdAAC1CAAgHgAAtggAIB8AALcIACAgAAC4CAAgIQAAuQgAINUCAgDHBQAh1gIBAMMFACHXAgEAwwUAIdoCAQDEBQAh3QJAAMYFACGKA0AAxgUAIaQDAQDEBQAhpQNAAOYFACHwAwEAwwUAIfEDAQDEBQAh8wMAALII8wMi9ANAAOYFACECAAAAAQAgJwAAbgAgDNUCAgDHBQAh1gIBAMMFACHXAgEAwwUAIdoCAQDEBQAh3QJAAMYFACGKA0AAxgUAIaQDAQDEBQAhpQNAAOYFACHwAwEAwwUAIfEDAQDEBQAh8wMAALII8wMi9ANAAOYFACECAAAAJwAgJwAAcAAgAwAAAAEAICwAAGoAIC0AAG4AIAEAAAABACABAAAAJwAgCgkAAK0IACAyAACuCAAgMwAAsQgAIDQAALAIACA1AACvCAAg2gIAAL0FACCkAwAAvQUAIKUDAAC9BQAg8QMAAL0FACD0AwAAvQUAIA_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_wQAMNMCAACyAQAQ1AIAAP8EADDVAgIAnQQAId0CQAChBAAhigNAAKEEACHjAwEAngQAIeQDAQCeBAAh7AMCAJ0EACEDAAAAEAAgAQAAsQEAMDEAALIBACADAAAAEAAgAQAAEQAwAgAAEgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAQAwAAzwcAIAYAANAHACAOAADRBwAg1QICAAAAAd0CQAAAAAHrAgEAAAABigNAAAAAAboDAgAAAAHYAwEAAAAB2gMBAAAAAdsDIAAAAAHhA0AAAAAB5QMBAAAAAegDAgAAAAHqAwEAAAAB6wMCAAAAAQEnAAC6AQAgDdUCAgAAAAHdAkAAAAAB6wIBAAAAAYoDQAAAAAG6AwIAAAAB2AMBAAAAAdoDAQAAAAHbAyAAAAAB4QNAAAAAAeUDAQAAAAHoAwIAAAAB6gMBAAAAAesDAgAAAAEBJwAAvAEAMBADAADABwAgBgAAwQcAIA4AAMIHACDVAgIAxwUAId0CQADGBQAh6wIBAMMFACGKA0AAxgUAIboDAgDHBQAh2AMBAMMFACHaAwEAxAUAIdsDIADFBQAh4QNAAOYFACHlAwEAwwUAIegDAgDHBQAh6gMBAMMFACHrAwIAxwUAIQIAAAAFACAnAAC-AQAgDdUCAgDHBQAh3QJAAMYFACHrAgEAwwUAIYoDQADGBQAhugMCAMcFACHYAwEAwwUAIdoDAQDEBQAh2wMgAMUFACHhA0AA5gUAIeUDAQDDBQAh6AMCAMcFACHqAwEAwwUAIesDAgDHBQAhAgAAAAMAICcAAMABACADAAAABQAgLAAAugEAIC0AAL4BACABAAAABQAgAQAAAAMAIAcJAAC7BwAgMgAAvAcAIDMAAL8HACA0AAC-BwAgNQAAvQcAINoDAAC9BQAg4QMAAL0FACAQ0gIAAP4EADDTAgAAxgEAENQCAAD-BAAw1QICAJ0EACHdAkAAoQQAIesCAQCeBAAhigNAAKEEACG6AwIAnQQAIdgDAQCeBAAh2gMBAJ8EACHbAyAAoAQAIeEDQADJBAAh5QMBAJ4EACHoAwIAnQQAIeoDAQCeBAAh6wMCAJ0EACEDAAAAAwAgAQAAxQEAMDEAAMYBACADAAAAAwAgAQAABAAwAgAABQAgAQAAACAAIAEAAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAAeACABAAAfADACAAAgACAHDQAAugcAINUCAgAAAAHdAkAAAAABigNAAAAAAeMDAQAAAAHkAwEAAAAB6QMCAAAAAQEnAADOAQAgBtUCAgAAAAHdAkAAAAABigNAAAAAAeMDAQAAAAHkAwEAAAAB6QMCAAAAAQEnAADQAQAwBw0AALkHACDVAgIAxwUAId0CQADGBQAhigNAAMYFACHjAwEAwwUAIeQDAQDDBQAh6QMCAMcFACECAAAAIAAgJwAA0gEAIAbVAgIAxwUAId0CQADGBQAhigNAAMYFACHjAwEAwwUAIeQDAQDDBQAh6QMCAMcFACECAAAAHgAgJwAA1AEAIAMAAAAgACAsAADOAQAgLQAA0gEAIAEAAAAgACABAAAAHgAgBQkAALQHACAyAAC1BwAgMwAAuAcAIDQAALcHACA1AAC2BwAgCdICAAD9BAAw0wIAANoBABDUAgAA_QQAMNUCAgCdBAAh3QJAAKEEACGKA0AAoQQAIeMDAQCeBAAh5AMBAJ4EACHpAwIAnQQAIQMAAAAeACABAADZAQAwMQAA2gEAIAMAAAAeACABAAAfADACAAAgACAOfwAA-gQAINICAAD4BAAw0wIAAOUBABDUAgAA-AQAMNUCAgAAAAHdAkAAswQAIesCAQCwBAAhigNAALMEACHYAwAA-QQAINsDIACyBAAh5QMBAAAAAeYDAQCxBAAh5wMBALAEACHoAwIArwQAIQEAAADdAQAgCn4AAPwEACDSAgAA-wQAMNMCAADfAQAQ1AIAAPsEADDVAgIArwQAId0CQACzBAAhigNAALMEACHiAwIArwQAIeMDAQCwBAAh5AMBALAEACECfgAAsgcAIPgDAACzBwAgCn4AAPwEACDSAgAA-wQAMNMCAADfAQAQ1AIAAPsEADDVAgIAAAAB3QJAALMEACGKA0AAswQAIeIDAgCvBAAh4wMBALAEACHkAwEAsAQAIQMAAADfAQAgAQAA4AEAMAIAAOEBACABAAAA3wEAIAEAAADdAQAgDn8AAPoEACDSAgAA-AQAMNMCAADlAQAQ1AIAAPgEADDVAgIArwQAId0CQACzBAAh6wIBALAEACGKA0AAswQAIdgDAAD5BAAg2wMgALIEACHlAwEAsAQAIeYDAQCxBAAh5wMBALAEACHoAwIArwQAIQN_AACwBwAg5gMAAL0FACD4AwAAsQcAIAMAAADlAQAgAQAA5gEAMAIAAN0BACADAAAA5QEAIAEAAOYBADACAADdAQAgAwAAAOUBACABAADmAQAwAgAA3QEAIAt_AACvBwAg1QICAAAAAd0CQAAAAAHrAgEAAAABigNAAAAAAdgDgAAAAAHbAyAAAAAB5QMBAAAAAeYDAQAAAAHnAwEAAAAB6AMCAAAAAQEnAADqAQAgCtUCAgAAAAHdAkAAAAAB6wIBAAAAAYoDQAAAAAHYA4AAAAAB2wMgAAAAAeUDAQAAAAHmAwEAAAAB5wMBAAAAAegDAgAAAAEBJwAA7AEAMAt_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_BgAg1QICAAAAAdYCAQAAAAHdAkAAAAABvAMBAAAAAQEnAADWAgAgBNUCAgAAAAHWAgEAAAAB3QJAAAAAAbwDAQAAAAEBJwAA2AIAMAUQAADyBgAg1QICAMcFACHWAgEAwwUAId0CQADGBQAhvAMBAMQFACECAAAAzwIAICcAANoCACAE1QICAMcFACHWAgEAwwUAId0CQADGBQAhvAMBAMQFACECAAAAKwAgJwAA3AIAIAMAAADPAgAgLAAA1gIAIC0AANoCACABAAAAzwIAIAEAAAArACAGCQAA7QYAIDIAAO4GACAzAADxBgAgNAAA8AYAIDUAAO8GACC8AwAAvQUAIAfSAgAA6AQAMNMCAADiAgAQ1AIAAOgEADDVAgIAnQQAIdYCAQCeBAAh3QJAAKEEACG8AwEAnwQAIQMAAAArACABAADhAgAwMQAA4gIAIAMAAAArACABAADSAgAwAgAAzwIAIAEAAAAuACABAAAALgAgAwAAACkAIAEAAC0AMAIAAC4AIAMAAAApACABAAAtADACAAAuACADAAAAKQAgAQAALQAwAgAALgAgIAYAAOsGACARAADsBgAg1QICAAAAAdYCAQAAAAHdAkAAAAABgwMAAADDAwKKA0AAAAABugMCAAAAAbsDAQAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABwAMCAAAAAcEDAgAAAAHDAyAAAAABxAMBAAAAAcUDQAAAAAHGA0AAAAABxwNAAAAAAcgDAQAAAAHJAxAAAAABygMBAAAAAcsDEAAAAAHMAwEAAAABzQMBAAAAAc4DEAAAAAHPAxAAAAAB0AMBAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAQEnAADqAgAgHtUCAgAAAAHWAgEAAAAB3QJAAAAAAYMDAAAAwwMCigNAAAAAAboDAgAAAAG7AwEAAAABvAMBAAAAAb0DAQAAAAG-AwEAAAABvwMBAAAAAcADAgAAAAHBAwIAAAABwwMgAAAAAcQDAQAAAAHFA0AAAAABxgNAAAAAAccDQAAAAAHIAwEAAAAByQMQAAAAAcoDAQAAAAHLAxAAAAABzAMBAAAAAc0DAQAAAAHOAxAAAAABzwMQAAAAAdADAQAAAAHRAwEAAAAB0gMBAAAAAdMDAgAAAAEBJwAA7AIAMCAGAADdBgAgEQAA3gYAINUCAgDHBQAh1gIBAMMFACHdAkAAxgUAIYMDAADcBsMDIooDQADGBQAhugMCANAFACG7AwEAxAUAIbwDAQDEBQAhvQMBAMQFACG-AwEAxAUAIb8DAQDEBQAhwAMCANAFACHBAwIAxwUAIcMDIADFBQAhxAMBAMQFACHFA0AA5gUAIcYDQADmBQAhxwNAAOYFACHIAwEAxAUAIckDEADjBQAhygMBAMQFACHLAxAA4wUAIcwDAQDEBQAhzQMBAMQFACHOAxAA4wUAIc8DEADjBQAh0AMBAMQFACHRAwEAxAUAIdIDAQDEBQAh0wMCAMcFACECAAAALgAgJwAA7gIAIB7VAgIAxwUAIdYCAQDDBQAh3QJAAMYFACGDAwAA3AbDAyKKA0AAxgUAIboDAgDQBQAhuwMBAMQFACG8AwEAxAUAIb0DAQDEBQAhvgMBAMQFACG_AwEAxAUAIcADAgDQBQAhwQMCAMcFACHDAyAAxQUAIcQDAQDEBQAhxQNAAOYFACHGA0AA5gUAIccDQADmBQAhyAMBAMQFACHJAxAA4wUAIcoDAQDEBQAhywMQAOMFACHMAwEAxAUAIc0DAQDEBQAhzgMQAOMFACHPAxAA4wUAIdADAQDEBQAh0QMBAMQFACHSAwEAxAUAIdMDAgDHBQAhAgAAACkAICcAAPACACADAAAALgAgLAAA6gIAIC0AAO4CACABAAAALgAgAQAAACkAIBcJAADXBgAgMgAA2AYAIDMAANsGACA0AADaBgAgNQAA2QYAILoDAAC9BQAguwMAAL0FACC8AwAAvQUAIL0DAAC9BQAgvgMAAL0FACC_AwAAvQUAIMADAAC9BQAgxAMAAL0FACDFAwAAvQUAIMYDAAC9BQAgxwMAAL0FACDIAwAAvQUAIMoDAAC9BQAgzAMAAL0FACDNAwAAvQUAINADAAC9BQAg0QMAAL0FACDSAwAAvQUAICHSAgAA5AQAMNMCAAD2AgAQ1AIAAOQEADDVAgIAnQQAIdYCAQCeBAAh3QJAAKEEACGDAwAA5QTDAyKKA0AAoQQAIboDAgC1BAAhuwMBAJ8EACG8AwEAnwQAIb0DAQCfBAAhvgMBAJ8EACG_AwEAnwQAIcADAgC1BAAhwQMCAJ0EACHDAyAAoAQAIcQDAQCfBAAhxQNAAMkEACHGA0AAyQQAIccDQADJBAAhyAMBAJ8EACHJAxAAxgQAIcoDAQCfBAAhywMQAMYEACHMAwEAnwQAIc0DAQCfBAAhzgMQAMYEACHPAxAAxgQAIdADAQCfBAAh0QMBAJ8EACHSAwEAnwQAIdMDAgCdBAAhAwAAACkAIAEAAPUCADAxAAD2AgAgAwAAACkAIAEAAC0AMAIAAC4AIAEAAAAlACABAAAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgJg8AANEGACASAADSBgAgFQAA0wYAIBcAANQGACAYAADVBgAgHAAA1gYAINUCAgAAAAHqAgIAAAABigNAAAAAAZwDAgAAAAGdAwAAAJoDAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDAQAAAAGjAwAAAKMDA6QDAQAAAAGlA0AAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrAwEAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAEBJwAA_gIAICDVAgIAAAAB6gICAAAAAYoDQAAAAAGcAwIAAAABnQMAAACaAwKeAwEAAAABnwMBAAAAAaADQAAAAAGhAwEAAAABowMAAACjAwOkAwEAAAABpQNAAAAAAaYDAQAAAAGnAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABqwMBAAAAAawDAQAAAAGtAwEAAAABrgMBAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAbIDAQAAAAGzAwEAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABtwMBAAAAAbgDAQAAAAG5AwEAAAABAScAAIADADAmDwAAmwYAIBIAAJwGACAVAACdBgAgFwAAngYAIBgAAJ8GACAcAACgBgAg1QICAMcFACHqAgIA0AUAIYoDQADGBQAhnAMCANAFACGdAwAAhgaaAyKeAwEAwwUAIZ8DAQDEBQAhoANAAMYFACGhAwEAxAUAIaMDAACaBqMDI6QDAQDEBQAhpQNAAOYFACGmAwEAxAUAIacDAQDEBQAhqAMBAMQFACGpAwEAxAUAIaoDAQDEBQAhqwMBAMQFACGsAwEAxAUAIa0DAQDEBQAhrgMBAMQFACGvAwEAxAUAIbADAQDEBQAhsQMBAMQFACGyAwEAxAUAIbMDAQDEBQAhtAMBAMQFACG1AwEAxAUAIbYDAQDEBQAhtwMBAMQFACG4AwEAxAUAIbkDAQDEBQAhAgAAACUAICcAAIIDACAg1QICAMcFACHqAgIA0AUAIYoDQADGBQAhnAMCANAFACGdAwAAhgaaAyKeAwEAwwUAIZ8DAQDEBQAhoANAAMYFACGhAwEAxAUAIaMDAACaBqMDI6QDAQDEBQAhpQNAAOYFACGmAwEAxAUAIacDAQDEBQAhqAMBAMQFACGpAwEAxAUAIaoDAQDEBQAhqwMBAMQFACGsAwEAxAUAIa0DAQDEBQAhrgMBAMQFACGvAwEAxAUAIbADAQDEBQAhsQMBAMQFACGyAwEAxAUAIbMDAQDEBQAhtAMBAMQFACG1AwEAxAUAIbYDAQDEBQAhtwMBAMQFACG4AwEAxAUAIbkDAQDEBQAhAgAAACMAICcAAIQDACADAAAAJQAgLAAA_gIAIC0AAIIDACABAAAAJQAgAQAAACMAICAJAACVBgAgMgAAlgYAIDMAAJkGACA0AACYBgAgNQAAlwYAIOoCAAC9BQAgnAMAAL0FACCfAwAAvQUAIKEDAAC9BQAgowMAAL0FACCkAwAAvQUAIKUDAAC9BQAgpgMAAL0FACCnAwAAvQUAIKgDAAC9BQAgqQMAAL0FACCqAwAAvQUAIKsDAAC9BQAgrAMAAL0FACCtAwAAvQUAIK4DAAC9BQAgrwMAAL0FACCwAwAAvQUAILEDAAC9BQAgsgMAAL0FACCzAwAAvQUAILQDAAC9BQAgtQMAAL0FACC2AwAAvQUAILcDAAC9BQAguAMAAL0FACC5AwAAvQUAICPSAgAA4AQAMNMCAACKAwAQ1AIAAOAEADDVAgIAnQQAIeoCAgC1BAAhigNAAKEEACGcAwIAtQQAIZ0DAADZBJoDIp4DAQCeBAAhnwMBAJ8EACGgA0AAoQQAIaEDAQCfBAAhowMAAOEEowMjpAMBAJ8EACGlA0AAyQQAIaYDAQCfBAAhpwMBAJ8EACGoAwEAnwQAIakDAQCfBAAhqgMBAJ8EACGrAwEAnwQAIawDAQCfBAAhrQMBAJ8EACGuAwEAnwQAIa8DAQCfBAAhsAMBAJ8EACGxAwEAnwQAIbIDAQCfBAAhswMBAJ8EACG0AwEAnwQAIbUDAQCfBAAhtgMBAJ8EACG3AwEAnwQAIbgDAQCfBAAhuQMBAJ8EACEDAAAAIwAgAQAAiQMAMDEAAIoDACADAAAAIwAgAQAAJAAwAgAAJQAgAQAAADUAIAEAAAA1ACADAAAAMwAgAQAANAAwAgAANQAgAwAAADMAIAEAADQAMAIAADUAIAMAAAAzACABAAA0ADACAAA1ACAJEwAAkwYAIBQAAJQGACDVAgIAAAAB8wIAAACaAwP0AgAAAJoDA_YCAQAAAAH3AgIAAAAB-AJAAAAAAfsCAgAAAAEBJwAAkgMAIAfVAgIAAAAB8wIAAACaAwP0AgAAAJoDA_YCAQAAAAH3AgIAAAAB-AJAAAAAAfsCAgAAAAEBJwAAlAMAMAkTAACRBgAgFAAAkgYAINUCAgDHBQAh8wIAAJAGmgMj9AIAAJAGmgMj9gIBAMQFACH3AgIA0AUAIfgCQADGBQAh-wICANAFACECAAAANQAgJwAAlgMAIAfVAgIAxwUAIfMCAACQBpoDI_QCAACQBpoDI_YCAQDEBQAh9wICANAFACH4AkAAxgUAIfsCAgDQBQAhAgAAADMAICcAAJgDACADAAAANQAgLAAAkgMAIC0AAJYDACABAAAANQAgAQAAADMAIAoJAACLBgAgMgAAjAYAIDMAAI8GACA0AACOBgAgNQAAjQYAIPMCAAC9BQAg9AIAAL0FACD2AgAAvQUAIPcCAAC9BQAg-wIAAL0FACAK0gIAANwEADDTAgAAngMAENQCAADcBAAw1QICAJ0EACHzAgAA3QSaAyP0AgAA3QSaAyP2AgEAnwQAIfcCAgC1BAAh-AJAAKEEACH7AgIAtQQAIQMAAAAzACABAACdAwAwMQAAngMAIAMAAAAzACABAAA0ADACAAA1ACABAAAAOwAgAQAAADsAIAMAAAA5ACABAAA6ADACAAA7ACADAAAAOQAgAQAAOgAwAgAAOwAgAwAAADkAIAEAADoAMAIAADsAIAoTAACJBgAgFgAAigYAINUCAgAAAAHdAkAAAAAB9gIBAAAAAfsCAgAAAAGDAwAAAJoDAooDQAAAAAGaAwIAAAABmwNAAAAAAQEnAACmAwAgCNUCAgAAAAHdAkAAAAAB9gIBAAAAAfsCAgAAAAGDAwAAAJoDAooDQAAAAAGaAwIAAAABmwNAAAAAAQEnAACoAwAwChMAAIcGACAWAACIBgAg1QICAMcFACHdAkAAxgUAIfYCAQDEBQAh-wICANAFACGDAwAAhgaaAyKKA0AAxgUAIZoDAgDQBQAhmwNAAOYFACECAAAAOwAgJwAAqgMAIAjVAgIAxwUAId0CQADGBQAh9gIBAMQFACH7AgIA0AUAIYMDAACGBpoDIooDQADGBQAhmgMCANAFACGbA0AA5gUAIQIAAAA5ACAnAACsAwAgAwAAADsAICwAAKYDACAtAACqAwAgAQAAADsAIAEAAAA5ACAJCQAAgQYAIDIAAIIGACAzAACFBgAgNAAAhAYAIDUAAIMGACD2AgAAvQUAIPsCAAC9BQAgmgMAAL0FACCbAwAAvQUAIAvSAgAA2AQAMNMCAACyAwAQ1AIAANgEADDVAgIAnQQAId0CQAChBAAh9gIBAJ8EACH7AgIAtQQAIYMDAADZBJoDIooDQAChBAAhmgMCALUEACGbA0AAyQQAIQMAAAA5ACABAACxAwAwMQAAsgMAIAMAAAA5ACABAAA6ADACAAA7ACABAAAAQQAgAQAAAEEAIAMAAAA_ACABAABAADACAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAkTAACABgAg1QICAAAAAd0CQAAAAAH2AgEAAAAB-wICAAAAAYMDAAAAmAMCigNAAAAAAZYDAQAAAAGYA0AAAAABAScAALoDACAI1QICAAAAAd0CQAAAAAH2AgEAAAAB-wICAAAAAYMDAAAAmAMCigNAAAAAAZYDAQAAAAGYA0AAAAABAScAALwDADAJEwAA_wUAINUCAgDHBQAh3QJAAMYFACH2AgEAxAUAIfsCAgDQBQAhgwMAAP4FmAMiigNAAMYFACGWAwEAxAUAIZgDQADmBQAhAgAAAEEAICcAAL4DACAI1QICAMcFACHdAkAAxgUAIfYCAQDEBQAh-wICANAFACGDAwAA_gWYAyKKA0AAxgUAIZYDAQDEBQAhmANAAOYFACECAAAAPwAgJwAAwAMAIAMAAABBACAsAAC6AwAgLQAAvgMAIAEAAABBACABAAAAPwAgCQkAAPkFACAyAAD6BQAgMwAA_QUAIDQAAPwFACA1AAD7BQAg9gIAAL0FACD7AgAAvQUAIJYDAAC9BQAgmAMAAL0FACAL0gIAANQEADDTAgAAxgMAENQCAADUBAAw1QICAJ0EACHdAkAAoQQAIfYCAQCfBAAh-wICALUEACGDAwAA1QSYAyKKA0AAoQQAIZYDAQCfBAAhmANAAMkEACEDAAAAPwAgAQAAxQMAMDEAAMYDACADAAAAPwAgAQAAQAAwAgAAQQAgAQAAAEYAIAEAAABGACADAAAARAAgAQAARQAwAgAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAABEACABAABFADACAABGACAaEwAA9gUAIBkAAPcFACAbAAD4BQAg1QICAAAAAd0CQAAAAAH2AgEAAAAB-wICAAAAAfwCAQAAAAH9AhAAAAAB_gIQAAAAAYADAAAAgAMCgQMBAAAAAYIDAQAAAAGDAwAAAPMCAoQDQAAAAAGFAwEAAAABhgNAAAAAAYcDAgAAAAGIA0AAAAABiQMBAAAAAYoDQAAAAAGLAyAAAAABjAOAAAAAAY0DAgAAAAGOA0AAAAABjwNAAAAAAQEnAADOAwAgF9UCAgAAAAHdAkAAAAAB9gIBAAAAAfsCAgAAAAH8AgEAAAAB_QIQAAAAAf4CEAAAAAGAAwAAAIADAoEDAQAAAAGCAwEAAAABgwMAAADzAgKEA0AAAAABhQMBAAAAAYYDQAAAAAGHAwIAAAABiANAAAAAAYkDAQAAAAGKA0AAAAABiwMgAAAAAYwDgAAAAAGNAwIAAAABjgNAAAAAAY8DQAAAAAEBJwAA0AMAMBoTAADnBQAgGQAA6AUAIBsAAOkFACDVAgIAxwUAId0CQADGBQAh9gIBAMQFACH7AgIA0AUAIfwCAQDDBQAh_QIQAOMFACH-AhAA4wUAIYADAADkBYADIoEDAQDEBQAhggMBAMQFACGDAwAA5QXzAiKEA0AA5gUAIYUDAQDEBQAhhgNAAOYFACGHAwIA0AUAIYgDQADmBQAhiQMBAMQFACGKA0AAxgUAIYsDIADFBQAhjAOAAAAAAY0DAgDHBQAhjgNAAOYFACGPA0AA5gUAIQIAAABGACAnAADSAwAgF9UCAgDHBQAh3QJAAMYFACH2AgEAxAUAIfsCAgDQBQAh_AIBAMMFACH9AhAA4wUAIf4CEADjBQAhgAMAAOQFgAMigQMBAMQFACGCAwEAxAUAIYMDAADlBfMCIoQDQADmBQAhhQMBAMQFACGGA0AA5gUAIYcDAgDQBQAhiANAAOYFACGJAwEAxAUAIYoDQADGBQAhiwMgAMUFACGMA4AAAAABjQMCAMcFACGOA0AA5gUAIY8DQADmBQAhAgAAAEQAICcAANQDACADAAAARgAgLAAAzgMAIC0AANIDACABAAAARgAgAQAAAEQAIBIJAADeBQAgMgAA3wUAIDMAAOIFACA0AADhBQAgNQAA4AUAIPYCAAC9BQAg-wIAAL0FACCBAwAAvQUAIIIDAAC9BQAghAMAAL0FACCFAwAAvQUAIIYDAAC9BQAghwMAAL0FACCIAwAAvQUAIIkDAAC9BQAgjAMAAL0FACCOAwAAvQUAII8DAAC9BQAgGtICAADFBAAw0wIAANoDABDUAgAAxQQAMNUCAgCdBAAh3QJAAKEEACH2AgEAnwQAIfsCAgC1BAAh_AIBAJ4EACH9AhAAxgQAIf4CEADGBAAhgAMAAMcEgAMigQMBAJ8EACGCAwEAnwQAIYMDAADIBPMCIoQDQADJBAAhhQMBAJ8EACGGA0AAyQQAIYcDAgC1BAAhiANAAMkEACGJAwEAnwQAIYoDQAChBAAhiwMgAKAEACGMAwAAygQAII0DAgCdBAAhjgNAAMkEACGPA0AAyQQAIQMAAABEACABAADZAwAwMQAA2gMAIAMAAABEACABAABFADACAABGACABAAAATAAgAQAAAEwAIAMAAABKACABAABLADACAABMACADAAAASgAgAQAASwAwAgAATAAgAwAAAEoAIAEAAEsAMAIAAEwAIAwUAADdBQAgGgAA3AUAINUCAgAAAAHxAgIAAAAB8wIAAADzAgP0AgAAAPMCA_UCEAAAAAH2AgEAAAAB9wICAAAAAfgCQAAAAAH5AhAAAAAB-gIQAAAAAQEnAADiAwAgCtUCAgAAAAHxAgIAAAAB8wIAAADzAgP0AgAAAPMCA_UCEAAAAAH2AgEAAAAB9wICAAAAAfgCQAAAAAH5AhAAAAAB-gIQAAAAAQEnAADkAwAwDBQAANsFACAaAADaBQAg1QICAMcFACHxAgIA0AUAIfMCAADYBfMCI_QCAADYBfMCI_UCEADZBQAh9gIBAMQFACH3AgIA0AUAIfgCQADGBQAh-QIQANkFACH6AhAA2QUAIQIAAABMACAnAADmAwAgCtUCAgDHBQAh8QICANAFACHzAgAA2AXzAiP0AgAA2AXzAiP1AhAA2QUAIfYCAQDEBQAh9wICANAFACH4AkAAxgUAIfkCEADZBQAh-gIQANkFACECAAAASgAgJwAA6AMAIAMAAABMACAsAADiAwAgLQAA5gMAIAEAAABMACABAAAASgAgDQkAANMFACAyAADUBQAgMwAA1wUAIDQAANYFACA1AADVBQAg8QIAAL0FACDzAgAAvQUAIPQCAAC9BQAg9QIAAL0FACD2AgAAvQUAIPcCAAC9BQAg-QIAAL0FACD6AgAAvQUAIA3SAgAAvgQAMNMCAADuAwAQ1AIAAL4EADDVAgIAnQQAIfECAgC1BAAh8wIAAL8E8wIj9AIAAL8E8wIj9QIQAMAEACH2AgEAnwQAIfcCAgC1BAAh-AJAAKEEACH5AhAAwAQAIfoCEADABAAhAwAAAEoAIAEAAO0DADAxAADuAwAgAwAAAEoAIAEAAEsAMAIAAEwAIAEAAABbACABAAAAWwAgAwAAAFkAIAEAAFoAMAIAAFsAIAMAAABZACABAABaADACAABbACADAAAAWQAgAQAAWgAwAgAAWwAgCg8AANIFACDVAgIAAAAB2QIBAAAAAdwCIAAAAAHdAkAAAAAB6gICAAAAAesCAQAAAAHtAgAAAO0CAu8CAAAA7wID8AICAAAAAQEnAAD2AwAgCdUCAgAAAAHZAgEAAAAB3AIgAAAAAd0CQAAAAAHqAgIAAAAB6wIBAAAAAe0CAAAA7QIC7wIAAADvAgPwAgIAAAABAScAAPgDADAKDwAA0QUAINUCAgDHBQAh2QIBAMMFACHcAiAAxQUAId0CQADGBQAh6gICANAFACHrAgEAwwUAIe0CAADOBe0CIu8CAADPBe8CI_ACAgDQBQAhAgAAAFsAICcAAPoDACAJ1QICAMcFACHZAgEAwwUAIdwCIADFBQAh3QJAAMYFACHqAgIA0AUAIesCAQDDBQAh7QIAAM4F7QIi7wIAAM8F7wIj8AICANAFACECAAAAWQAgJwAA_AMAIAMAAABbACAsAAD2AwAgLQAA-gMAIAEAAABbACABAAAAWQAgCAkAAMkFACAyAADKBQAgMwAAzQUAIDQAAMwFACA1AADLBQAg6gIAAL0FACDvAgAAvQUAIPACAAC9BQAgDNICAAC0BAAw0wIAAIIEABDUAgAAtAQAMNUCAgCdBAAh2QIBAJ4EACHcAiAAoAQAId0CQAChBAAh6gICALUEACHrAgEAngQAIe0CAAC2BO0CIu8CAAC3BO8CI_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_ACAgC1BAAhDQkAAKgEACAyAAC9BAAgMwAAqAQAIDQAAKgEACA1AACoBAAg3gICAAAAAd8CAgAAAAXgAgIAAAAF4QICAAAAAeICAgAAAAHjAgIAAAAB5AICAAAAAeUCAgC8BAAhBwkAAKMEACA0AAC7BAAgNQAAuwQAIN4CAAAA7QIC3wIAAADtAgjgAgAAAO0CCOUCAAC6BO0CIgcJAACoBAAgNAAAuQQAIDUAALkEACDeAgAAAO8CA98CAAAA7wIJ4AIAAADvAgnlAgAAuATvAiMHCQAAqAQAIDQAALkEACA1AAC5BAAg3gIAAADvAgPfAgAAAO8CCeACAAAA7wIJ5QIAALgE7wIjBN4CAAAA7wID3wIAAADvAgngAgAAAO8CCeUCAAC5BO8CIwcJAACjBAAgNAAAuwQAIDUAALsEACDeAgAAAO0CAt8CAAAA7QII4AIAAADtAgjlAgAAugTtAiIE3gIAAADtAgLfAgAAAO0CCOACAAAA7QII5QIAALsE7QIiDQkAAKgEACAyAAC9BAAgMwAAqAQAIDQAAKgEACA1AACoBAAg3gICAAAAAd8CAgAAAAXgAgIAAAAF4QICAAAAAeICAgAAAAHjAgIAAAAB5AICAAAAAeUCAgC8BAAhCN4CCAAAAAHfAggAAAAF4AIIAAAABeECCAAAAAHiAggAAAAB4wIIAAAAAeQCCAAAAAHlAggAvQQAIQ3SAgAAvgQAMNMCAADuAwAQ1AIAAL4EADDVAgIAnQQAIfECAgC1BAAh8wIAAL8E8wIj9AIAAL8E8wIj9QIQAMAEACH2AgEAnwQAIfcCAgC1BAAh-AJAAKEEACH5AhAAwAQAIfoCEADABAAhBwkAAKgEACA0AADEBAAgNQAAxAQAIN4CAAAA8wID3wIAAADzAgngAgAAAPMCCeUCAADDBPMCIw0JAACoBAAgMgAAwgQAIDMAAMIEACA0AADCBAAgNQAAwgQAIN4CEAAAAAHfAhAAAAAF4AIQAAAABeECEAAAAAHiAhAAAAAB4wIQAAAAAeQCEAAAAAHlAhAAwQQAIQ0JAACoBAAgMgAAwgQAIDMAAMIEACA0AADCBAAgNQAAwgQAIN4CEAAAAAHfAhAAAAAF4AIQAAAABeECEAAAAAHiAhAAAAAB4wIQAAAAAeQCEAAAAAHlAhAAwQQAIQjeAhAAAAAB3wIQAAAABeACEAAAAAXhAhAAAAAB4gIQAAAAAeMCEAAAAAHkAhAAAAAB5QIQAMIEACEHCQAAqAQAIDQAAMQEACA1AADEBAAg3gIAAADzAgPfAgAAAPMCCeACAAAA8wIJ5QIAAMME8wIjBN4CAAAA8wID3wIAAADzAgngAgAAAPMCCeUCAADEBPMCIxrSAgAAxQQAMNMCAADaAwAQ1AIAAMUEADDVAgIAnQQAId0CQAChBAAh9gIBAJ8EACH7AgIAtQQAIfwCAQCeBAAh_QIQAMYEACH-AhAAxgQAIYADAADHBIADIoEDAQCfBAAhggMBAJ8EACGDAwAAyATzAiKEA0AAyQQAIYUDAQCfBAAhhgNAAMkEACGHAwIAtQQAIYgDQADJBAAhiQMBAJ8EACGKA0AAoQQAIYsDIACgBAAhjAMAAMoEACCNAwIAnQQAIY4DQADJBAAhjwNAAMkEACENCQAAowQAIDIAANMEACAzAADTBAAgNAAA0wQAIDUAANMEACDeAhAAAAAB3wIQAAAABOACEAAAAAThAhAAAAAB4gIQAAAAAeMCEAAAAAHkAhAAAAAB5QIQANIEACEHCQAAowQAIDQAANEEACA1AADRBAAg3gIAAACAAwLfAgAAAIADCOACAAAAgAMI5QIAANAEgAMiBwkAAKMEACA0AADPBAAgNQAAzwQAIN4CAAAA8wIC3wIAAADzAgjgAgAAAPMCCOUCAADOBPMCIgsJAACoBAAgNAAAzQQAIDUAAM0EACDeAkAAAAAB3wJAAAAABeACQAAAAAXhAkAAAAAB4gJAAAAAAeMCQAAAAAHkAkAAAAAB5QJAAMwEACEPCQAAqAQAIDQAAMsEACA1AADLBAAg3gKAAAAAAeECgAAAAAHiAoAAAAAB4wKAAAAAAeQCgAAAAAHlAoAAAAABkAMBAAAAAZEDAQAAAAGSAwEAAAABkwOAAAAAAZQDgAAAAAGVA4AAAAABDN4CgAAAAAHhAoAAAAAB4gKAAAAAAeMCgAAAAAHkAoAAAAAB5QKAAAAAAZADAQAAAAGRAwEAAAABkgMBAAAAAZMDgAAAAAGUA4AAAAABlQOAAAAAAQsJAACoBAAgNAAAzQQAIDUAAM0EACDeAkAAAAAB3wJAAAAABeACQAAAAAXhAkAAAAAB4gJAAAAAAeMCQAAAAAHkAkAAAAAB5QJAAMwEACEI3gJAAAAAAd8CQAAAAAXgAkAAAAAF4QJAAAAAAeICQAAAAAHjAkAAAAAB5AJAAAAAAeUCQADNBAAhBwkAAKMEACA0AADPBAAgNQAAzwQAIN4CAAAA8wIC3wIAAADzAgjgAgAAAPMCCOUCAADOBPMCIgTeAgAAAPMCAt8CAAAA8wII4AIAAADzAgjlAgAAzwTzAiIHCQAAowQAIDQAANEEACA1AADRBAAg3gIAAACAAwLfAgAAAIADCOACAAAAgAMI5QIAANAEgAMiBN4CAAAAgAMC3wIAAACAAwjgAgAAAIADCOUCAADRBIADIg0JAACjBAAgMgAA0wQAIDMAANMEACA0AADTBAAgNQAA0wQAIN4CEAAAAAHfAhAAAAAE4AIQAAAABOECEAAAAAHiAhAAAAAB4wIQAAAAAeQCEAAAAAHlAhAA0gQAIQjeAhAAAAAB3wIQAAAABOACEAAAAAThAhAAAAAB4gIQAAAAAeMCEAAAAAHkAhAAAAAB5QIQANMEACEL0gIAANQEADDTAgAAxgMAENQCAADUBAAw1QICAJ0EACHdAkAAoQQAIfYCAQCfBAAh-wICALUEACGDAwAA1QSYAyKKA0AAoQQAIZYDAQCfBAAhmANAAMkEACEHCQAAowQAIDQAANcEACA1AADXBAAg3gIAAACYAwLfAgAAAJgDCOACAAAAmAMI5QIAANYEmAMiBwkAAKMEACA0AADXBAAgNQAA1wQAIN4CAAAAmAMC3wIAAACYAwjgAgAAAJgDCOUCAADWBJgDIgTeAgAAAJgDAt8CAAAAmAMI4AIAAACYAwjlAgAA1wSYAyIL0gIAANgEADDTAgAAsgMAENQCAADYBAAw1QICAJ0EACHdAkAAoQQAIfYCAQCfBAAh-wICALUEACGDAwAA2QSaAyKKA0AAoQQAIZoDAgC1BAAhmwNAAMkEACEHCQAAowQAIDQAANsEACA1AADbBAAg3gIAAACaAwLfAgAAAJoDCOACAAAAmgMI5QIAANoEmgMiBwkAAKMEACA0AADbBAAgNQAA2wQAIN4CAAAAmgMC3wIAAACaAwjgAgAAAJoDCOUCAADaBJoDIgTeAgAAAJoDAt8CAAAAmgMI4AIAAACaAwjlAgAA2wSaAyIK0gIAANwEADDTAgAAngMAENQCAADcBAAw1QICAJ0EACHzAgAA3QSaAyP0AgAA3QSaAyP2AgEAnwQAIfcCAgC1BAAh-AJAAKEEACH7AgIAtQQAIQcJAACoBAAgNAAA3wQAIDUAAN8EACDeAgAAAJoDA98CAAAAmgMJ4AIAAACaAwnlAgAA3gSaAyMHCQAAqAQAIDQAAN8EACA1AADfBAAg3gIAAACaAwPfAgAAAJoDCeACAAAAmgMJ5QIAAN4EmgMjBN4CAAAAmgMD3wIAAACaAwngAgAAAJoDCeUCAADfBJoDIyPSAgAA4AQAMNMCAACKAwAQ1AIAAOAEADDVAgIAnQQAIeoCAgC1BAAhigNAAKEEACGcAwIAtQQAIZ0DAADZBJoDIp4DAQCeBAAhnwMBAJ8EACGgA0AAoQQAIaEDAQCfBAAhowMAAOEEowMjpAMBAJ8EACGlA0AAyQQAIaYDAQCfBAAhpwMBAJ8EACGoAwEAnwQAIakDAQCfBAAhqgMBAJ8EACGrAwEAnwQAIawDAQCfBAAhrQMBAJ8EACGuAwEAnwQAIa8DAQCfBAAhsAMBAJ8EACGxAwEAnwQAIbIDAQCfBAAhswMBAJ8EACG0AwEAnwQAIbUDAQCfBAAhtgMBAJ8EACG3AwEAnwQAIbgDAQCfBAAhuQMBAJ8EACEHCQAAqAQAIDQAAOMEACA1AADjBAAg3gIAAACjAwPfAgAAAKMDCeACAAAAowMJ5QIAAOIEowMjBwkAAKgEACA0AADjBAAgNQAA4wQAIN4CAAAAowMD3wIAAACjAwngAgAAAKMDCeUCAADiBKMDIwTeAgAAAKMDA98CAAAAowMJ4AIAAACjAwnlAgAA4wSjAyMh0gIAAOQEADDTAgAA9gIAENQCAADkBAAw1QICAJ0EACHWAgEAngQAId0CQAChBAAhgwMAAOUEwwMiigNAAKEEACG6AwIAtQQAIbsDAQCfBAAhvAMBAJ8EACG9AwEAnwQAIb4DAQCfBAAhvwMBAJ8EACHAAwIAtQQAIcEDAgCdBAAhwwMgAKAEACHEAwEAnwQAIcUDQADJBAAhxgNAAMkEACHHA0AAyQQAIcgDAQCfBAAhyQMQAMYEACHKAwEAnwQAIcsDEADGBAAhzAMBAJ8EACHNAwEAnwQAIc4DEADGBAAhzwMQAMYEACHQAwEAnwQAIdEDAQCfBAAh0gMBAJ8EACHTAwIAnQQAIQcJAACjBAAgNAAA5wQAIDUAAOcEACDeAgAAAMMDAt8CAAAAwwMI4AIAAADDAwjlAgAA5gTDAyIHCQAAowQAIDQAAOcEACA1AADnBAAg3gIAAADDAwLfAgAAAMMDCOACAAAAwwMI5QIAAOYEwwMiBN4CAAAAwwMC3wIAAADDAwjgAgAAAMMDCOUCAADnBMMDIgfSAgAA6AQAMNMCAADiAgAQ1AIAAOgEADDVAgIAnQQAIdYCAQCeBAAh3QJAAKEEACG8AwEAnwQAIQgQAADqBAAg0gIAAOkEADDTAgAAKwAQ1AIAAOkEADDVAgIArwQAIdYCAQCwBAAh3QJAALMEACG8AwEAsQQAIQPUAwAAKQAg1QMAACkAINYDAAApACAM0gIAAOsEADDTAgAAzAIAENQCAADrBAAw1QICAJ0EACHbAgEAngQAId0CQAChBAAhigNAAKEEACHXAwEAngQAIdgDAQCeBAAh2QMCAJ0EACHaAwEAnwQAIdsDIACgBAAhDNICAADsBAAw0wIAALsCABDUAgAA7AQAMNUCAgCvBAAh2wIBALAEACHdAkAAswQAIYoDQACzBAAh1wMBALAEACHYAwEAsAQAIdkDAgCvBAAh2gMBALEEACHbAyAAsgQAIQ3SAgAA7QQAMNMCAAC1AgAQ1AIAAO0EADDVAgIAnQQAIdYCAQCeBAAh3QJAAKEEACHtAgAA7gTdAyKKA0AAoQQAIdoDAQCfBAAh3QMBAJ4EACHeAwEAnwQAId8DAgCdBAAh4AMgAKAEACEHCQAAowQAIDQAAPAEACA1AADwBAAg3gIAAADdAwLfAgAAAN0DCOACAAAA3QMI5QIAAO8E3QMiBwkAAKMEACA0AADwBAAgNQAA8AQAIN4CAAAA3QMC3wIAAADdAwjgAgAAAN0DCOUCAADvBN0DIgTeAgAAAN0DAt8CAAAA3QMI4AIAAADdAwjlAgAA8ATdAyIN0gIAAPEEADDTAgAApAIAENQCAADxBAAw1QICAK8EACHWAgEAsAQAId0CQACzBAAh7QIAAPIE3QMiigNAALMEACHaAwEAsQQAId0DAQCwBAAh3gMBALEEACHfAwIArwQAIeADIACyBAAhBN4CAAAA3QMC3wIAAADdAwjgAgAAAN0DCOUCAADwBN0DIg3SAgAA8wQAMNMCAACeAgAQ1AIAAPMEADDVAgIAnQQAId0CQAChBAAh6wIBAJ4EACGKA0AAoQQAIboDAgCdBAAhvAMBAJ8EACHaAwEAngQAIdsDIACgBAAh3wMCAJ0EACHhA0AAyQQAIQnSAgAA9AQAMNMCAACKAgAQ1AIAAPQEADDVAgIAnQQAId0CQAChBAAhigNAAKEEACHiAwIAnQQAIeMDAQCeBAAh5AMBAJ4EACEN0gIAAPUEADDTAgAA9gEAENQCAAD1BAAw1QICAJ0EACHdAkAAoQQAIesCAQCeBAAhigNAAKEEACHYAwAA9gQAINsDIACgBAAh5QMBAJ4EACHmAwEAnwQAIecDAQCeBAAh6AMCAJ0EACEPCQAAowQAIDQAAPcEACA1AAD3BAAg3gKAAAAAAeECgAAAAAHiAoAAAAAB4wKAAAAAAeQCgAAAAAHlAoAAAAABkAMBAAAAAZEDAQAAAAGSAwEAAAABkwOAAAAAAZQDgAAAAAGVA4AAAAABDN4CgAAAAAHhAoAAAAAB4gKAAAAAAeMCgAAAAAHkAoAAAAAB5QKAAAAAAZADAQAAAAGRAwEAAAABkgMBAAAAAZMDgAAAAAGUA4AAAAABlQOAAAAAAQ5_AAD6BAAg0gIAAPgEADDTAgAA5QEAENQCAAD4BAAw1QICAK8EACHdAkAAswQAIesCAQCwBAAhigNAALMEACHYAwAA-QQAINsDIACyBAAh5QMBALAEACHmAwEAsQQAIecDAQCwBAAh6AMCAK8EACEM3gKAAAAAAeECgAAAAAHiAoAAAAAB4wKAAAAAAeQCgAAAAAHlAoAAAAABkAMBAAAAAZEDAQAAAAGSAwEAAAABkwOAAAAAAZQDgAAAAAGVA4AAAAABA9QDAADfAQAg1QMAAN8BACDWAwAA3wEAIAp-AAD8BAAg0gIAAPsEADDTAgAA3wEAENQCAAD7BAAw1QICAK8EACHdAkAAswQAIYoDQACzBAAh4gMCAK8EACHjAwEAsAQAIeQDAQCwBAAhEH8AAPoEACDSAgAA-AQAMNMCAADlAQAQ1AIAAPgEADDVAgIArwQAId0CQACzBAAh6wIBALAEACGKA0AAswQAIdgDAAD5BAAg2wMgALIEACHlAwEAsAQAIeYDAQCxBAAh5wMBALAEACHoAwIArwQAIfYDAADlAQAg9wMAAOUBACAJ0gIAAP0EADDTAgAA2gEAENQCAAD9BAAw1QICAJ0EACHdAkAAoQQAIYoDQAChBAAh4wMBAJ4EACHkAwEAngQAIekDAgCdBAAhENICAAD-BAAw0wIAAMYBABDUAgAA_gQAMNUCAgCdBAAh3QJAAKEEACHrAgEAngQAIYoDQAChBAAhugMCAJ0EACHYAwEAngQAIdoDAQCfBAAh2wMgAKAEACHhA0AAyQQAIeUDAQCeBAAh6AMCAJ0EACHqAwEAngQAIesDAgCdBAAhCdICAAD_BAAw0wIAALIBABDUAgAA_wQAMNUCAgCdBAAh3QJAAKEEACGKA0AAoQQAIeMDAQCeBAAh5AMBAJ4EACHsAwIAnQQAIRHSAgAAgAUAMNMCAACeAQAQ1AIAAIAFADDVAgIAnQQAId0CQAChBAAh6wIBAJ4EACGKA0AAoQQAIboDAgCdBAAhvAMBAJ4EACHIAwEAngQAIdoDAQCfBAAh2wMgAKAEACHhA0AAoQQAIeUDAQCeBAAh6AMCAJ0EACHtAwIAtQQAIe4DAQCfBAAhCdICAACBBQAw0wIAAIoBABDUAgAAgQUAMNUCAgCdBAAh1gIBAJ4EACHdAkAAoQQAIYoDQAChBAAh5QMBAJ4EACHvAwIAtQQAIQ_SAgAAggUAMNMCAAB2ABDUAgAAggUAMNUCAgCdBAAh1gIBAJ4EACHXAgEAngQAIdoCAQCfBAAh3QJAAKEEACGKA0AAoQQAIaQDAQCfBAAhpQNAAMkEACHwAwEAngQAIfEDAQCfBAAh8wMAAIMF8wMi9ANAAMkEACEHCQAAowQAIDQAAIUFACA1AACFBQAg3gIAAADzAwLfAgAAAPMDCOACAAAA8wMI5QIAAIQF8wMiBwkAAKMEACA0AACFBQAgNQAAhQUAIN4CAAAA8wMC3wIAAADzAwjgAgAAAPMDCOUCAACEBfMDIgTeAgAAAPMDAt8CAAAA8wMI4AIAAADzAwjlAgAAhQXzAyINDwAAigUAINICAACGBQAw0wIAAFkAENQCAACGBQAw1QICAK8EACHZAgEAsAQAIdwCIACyBAAh3QJAALMEACHqAgIAhwUAIesCAQCwBAAh7QIAAIgF7QIi7wIAAIkF7wIj8AICAIcFACEI3gICAAAAAd8CAgAAAAXgAgIAAAAF4QICAAAAAeICAgAAAAHjAgIAAAAB5AICAAAAAeUCAgCoBAAhBN4CAAAA7QIC3wIAAADtAgjgAgAAAO0CCOUCAAC7BO0CIgTeAgAAAO8CA98CAAAA7wIJ4AIAAADvAgnlAgAAuQTvAiMYCwAAowUAIBEAAKAFACAdAACkBQAgHgAApQUAIB8AAKYFACAgAACWBQAgIQAApwUAINICAAChBQAw0wIAACcAENQCAAChBQAw1QICAK8EACHWAgEAsAQAIdcCAQCwBAAh2gIBALEEACHdAkAAswQAIYoDQACzBAAhpAMBALEEACGlA0AAkwUAIfADAQCwBAAh8QMBALEEACHzAwAAogXzAyL0A0AAkwUAIfYDAAAnACD3AwAAJwAgDxQAAIoFACAaAACOBQAg0gIAAIsFADDTAgAASgAQ1AIAAIsFADDVAgIArwQAIfECAgCHBQAh8wIAAIwF8wIj9AIAAIwF8wIj9QIQAI0FACH2AgEAsQQAIfcCAgCHBQAh-AJAALMEACH5AhAAjQUAIfoCEACNBQAhBN4CAAAA8wID3wIAAADzAgngAgAAAPMCCeUCAADEBPMCIwjeAhAAAAAB3wIQAAAABeACEAAAAAXhAhAAAAAB4gIQAAAAAeMCEAAAAAHkAhAAAAAB5QIQAMIEACEfEwAAlQUAIBkAAIoFACAbAACWBQAg0gIAAI8FADDTAgAARAAQ1AIAAI8FADDVAgIArwQAId0CQACzBAAh9gIBALEEACH7AgIAhwUAIfwCAQCwBAAh_QIQAJAFACH-AhAAkAUAIYADAACRBYADIoEDAQCxBAAhggMBALEEACGDAwAAkgXzAiKEA0AAkwUAIYUDAQCxBAAhhgNAAJMFACGHAwIAhwUAIYgDQACTBQAhiQMBALEEACGKA0AAswQAIYsDIACyBAAhjAMAAJQFACCNAwIArwQAIY4DQACTBQAhjwNAAJMFACH2AwAARAAg9wMAAEQAIB0TAACVBQAgGQAAigUAIBsAAJYFACDSAgAAjwUAMNMCAABEABDUAgAAjwUAMNUCAgCvBAAh3QJAALMEACH2AgEAsQQAIfsCAgCHBQAh_AIBALAEACH9AhAAkAUAIf4CEACQBQAhgAMAAJEFgAMigQMBALEEACGCAwEAsQQAIYMDAACSBfMCIoQDQACTBQAhhQMBALEEACGGA0AAkwUAIYcDAgCHBQAhiANAAJMFACGJAwEAsQQAIYoDQACzBAAhiwMgALIEACGMAwAAlAUAII0DAgCvBAAhjgNAAJMFACGPA0AAkwUAIQjeAhAAAAAB3wIQAAAABOACEAAAAAThAhAAAAAB4gIQAAAAAeMCEAAAAAHkAhAAAAAB5QIQANMEACEE3gIAAACAAwLfAgAAAIADCOACAAAAgAMI5QIAANEEgAMiBN4CAAAA8wIC3wIAAADzAgjgAgAAAPMCCOUCAADPBPMCIgjeAkAAAAAB3wJAAAAABeACQAAAAAXhAkAAAAAB4gJAAAAAAeMCQAAAAAHkAkAAAAAB5QJAAM0EACEM3gKAAAAAAeECgAAAAAHiAoAAAAAB4wKAAAAAAeQCgAAAAAHlAoAAAAABkAMBAAAAAZEDAQAAAAGSAwEAAAABkwOAAAAAAZQDgAAAAAGVA4AAAAABKw8AAIoFACASAACrBQAgFQAApAUAIBcAAKUFACAYAACsBQAgHAAApgUAINICAACpBQAw0wIAACMAENQCAACpBQAw1QICAK8EACHqAgIAhwUAIYoDQACzBAAhnAMCAIcFACGdAwAAmgWaAyKeAwEAsAQAIZ8DAQCxBAAhoANAALMEACGhAwEAsQQAIaMDAACqBaMDI6QDAQCxBAAhpQNAAJMFACGmAwEAsQQAIacDAQCxBAAhqAMBALEEACGpAwEAsQQAIaoDAQCxBAAhqwMBALEEACGsAwEAsQQAIa0DAQCxBAAhrgMBALEEACGvAwEAsQQAIbADAQCxBAAhsQMBALEEACGyAwEAsQQAIbMDAQCxBAAhtAMBALEEACG1AwEAsQQAIbYDAQCxBAAhtwMBALEEACG4AwEAsQQAIbkDAQCxBAAh9gMAACMAIPcDAAAjACAD1AMAAEoAINUDAABKACDWAwAASgAgDBMAAJUFACDSAgAAlwUAMNMCAAA_ABDUAgAAlwUAMNUCAgCvBAAh3QJAALMEACH2AgEAsQQAIfsCAgCHBQAhgwMAAJgFmAMiigNAALMEACGWAwEAsQQAIZgDQACTBQAhBN4CAAAAmAMC3wIAAACYAwjgAgAAAJgDCOUCAADXBJgDIg0TAACVBQAgFgAAigUAINICAACZBQAw0wIAADkAENQCAACZBQAw1QICAK8EACHdAkAAswQAIfYCAQCxBAAh-wICAIcFACGDAwAAmgWaAyKKA0AAswQAIZoDAgCHBQAhmwNAAJMFACEE3gIAAACaAwLfAgAAAJoDCOACAAAAmgMI5QIAANsEmgMiDBMAAJUFACAUAACKBQAg0gIAAJsFADDTAgAAMwAQ1AIAAJsFADDVAgIArwQAIfMCAACcBZoDI_QCAACcBZoDI_YCAQCxBAAh9wICAIcFACH4AkAAswQAIfsCAgCHBQAhBN4CAAAAmgMD3wIAAACaAwngAgAAAJoDCeUCAADfBJoDIyMGAACfBQAgEQAAoAUAINICAACdBQAw0wIAACkAENQCAACdBQAw1QICAK8EACHWAgEAsAQAId0CQACzBAAhgwMAAJ4FwwMiigNAALMEACG6AwIAhwUAIbsDAQCxBAAhvAMBALEEACG9AwEAsQQAIb4DAQCxBAAhvwMBALEEACHAAwIAhwUAIcEDAgCvBAAhwwMgALIEACHEAwEAsQQAIcUDQACTBQAhxgNAAJMFACHHA0AAkwUAIcgDAQCxBAAhyQMQAJAFACHKAwEAsQQAIcsDEACQBQAhzAMBALEEACHNAwEAsQQAIc4DEACQBQAhzwMQAJAFACHQAwEAsQQAIdEDAQCxBAAh0gMBALEEACHTAwIArwQAIQTeAgAAAMMDAt8CAAAAwwMI4AIAAADDAwjlAgAA5wTDAyIKEAAA6gQAINICAADpBAAw0wIAACsAENQCAADpBAAw1QICAK8EACHWAgEAsAQAId0CQACzBAAhvAMBALEEACH2AwAAKwAg9wMAACsAIAPUAwAAIwAg1QMAACMAINYDAAAjACAWCwAAowUAIBEAAKAFACAdAACkBQAgHgAApQUAIB8AAKYFACAgAACWBQAgIQAApwUAINICAAChBQAw0wIAACcAENQCAAChBQAw1QICAK8EACHWAgEAsAQAIdcCAQCwBAAh2gIBALEEACHdAkAAswQAIYoDQACzBAAhpAMBALEEACGlA0AAkwUAIfADAQCwBAAh8QMBALEEACHzAwAAogXzAyL0A0AAkwUAIQTeAgAAAPMDAt8CAAAA8wMI4AIAAADzAwjlAgAAhQXzAyID1AMAAAMAINUDAAADACDWAwAAAwAgA9QDAAAzACDVAwAAMwAg1gMAADMAIAPUAwAAOQAg1QMAADkAINYDAAA5ACAD1AMAAEQAINUDAABEACDWAwAARAAgA9QDAABZACDVAwAAWQAg1gMAAFkAIALqAgIAAAABnAMCAAAAASkPAACKBQAgEgAAqwUAIBUAAKQFACAXAAClBQAgGAAArAUAIBwAAKYFACDSAgAAqQUAMNMCAAAjABDUAgAAqQUAMNUCAgCvBAAh6gICAIcFACGKA0AAswQAIZwDAgCHBQAhnQMAAJoFmgMingMBALAEACGfAwEAsQQAIaADQACzBAAhoQMBALEEACGjAwAAqgWjAyOkAwEAsQQAIaUDQACTBQAhpgMBALEEACGnAwEAsQQAIagDAQCxBAAhqQMBALEEACGqAwEAsQQAIasDAQCxBAAhrAMBALEEACGtAwEAsQQAIa4DAQCxBAAhrwMBALEEACGwAwEAsQQAIbEDAQCxBAAhsgMBALEEACGzAwEAsQQAIbQDAQCxBAAhtQMBALEEACG2AwEAsQQAIbcDAQCxBAAhuAMBALEEACG5AwEAsQQAIQTeAgAAAKMDA98CAAAAowMJ4AIAAACjAwnlAgAA4wSjAyMlBgAAnwUAIBEAAKAFACDSAgAAnQUAMNMCAAApABDUAgAAnQUAMNUCAgCvBAAh1gIBALAEACHdAkAAswQAIYMDAACeBcMDIooDQACzBAAhugMCAIcFACG7AwEAsQQAIbwDAQCxBAAhvQMBALEEACG-AwEAsQQAIb8DAQCxBAAhwAMCAIcFACHBAwIArwQAIcMDIACyBAAhxAMBALEEACHFA0AAkwUAIcYDQACTBQAhxwNAAJMFACHIAwEAsQQAIckDEACQBQAhygMBALEEACHLAxAAkAUAIcwDAQCxBAAhzQMBALEEACHOAxAAkAUAIc8DEACQBQAh0AMBALEEACHRAwEAsQQAIdIDAQCxBAAh0wMCAK8EACH2AwAAKQAg9wMAACkAIAPUAwAAPwAg1QMAAD8AINYDAAA_ACAKDQAArgUAINICAACtBQAw0wIAAB4AENQCAACtBQAw1QICAK8EACHdAkAAswQAIYoDQACzBAAh4wMBALAEACHkAwEAsAQAIekDAgCvBAAhFQMAALsFACAGAACwBQAgDgAAvAUAINICAAC6BQAw0wIAAAMAENQCAAC6BQAw1QICAK8EACHdAkAAswQAIesCAQCwBAAhigNAALMEACG6AwIArwQAIdgDAQCwBAAh2gMBALEEACHbAyAAsgQAIeEDQACTBQAh5QMBALAEACHoAwIArwQAIeoDAQCwBAAh6wMCAK8EACH2AwAAAwAg9wMAAAMAIA4GAACwBQAg0gIAAK8FADDTAgAAFgAQ1AIAAK8FADDVAgIArwQAId0CQACzBAAh6wIBALAEACGKA0AAswQAIboDAgCvBAAhvAMBALEEACHaAwEAsAQAIdsDIACyBAAh3wMCAK8EACHhA0AAkwUAIRAEAAC2BQAgBQAAtwUAIAoAALgFACALAACjBQAgDAAAuQUAINICAAC1BQAw0wIAAAcAENQCAAC1BQAw1QICAK8EACHWAgEAsAQAId0CQACzBAAhigNAALMEACHlAwEAsAQAIe8DAgCHBQAh9gMAAAcAIPcDAAAHACAKBwAAsgUAINICAACxBQAw0wIAABAAENQCAACxBQAw1QICAK8EACHdAkAAswQAIYoDQACzBAAh4wMBALAEACHkAwEAsAQAIewDAgCvBAAhFQYAALAFACAIAAC0BQAg0gIAALMFADDTAgAADAAQ1AIAALMFADDVAgIArwQAId0CQACzBAAh6wIBALAEACGKA0AAswQAIboDAgCvBAAhvAMBALAEACHIAwEAsAQAIdoDAQCxBAAh2wMgALIEACHhA0AAswQAIeUDAQCwBAAh6AMCAK8EACHtAwIAhwUAIe4DAQCxBAAh9gMAAAwAIPcDAAAMACATBgAAsAUAIAgAALQFACDSAgAAswUAMNMCAAAMABDUAgAAswUAMNUCAgCvBAAh3QJAALMEACHrAgEAsAQAIYoDQACzBAAhugMCAK8EACG8AwEAsAQAIcgDAQCwBAAh2gMBALEEACHbAyAAsgQAIeEDQACzBAAh5QMBALAEACHoAwIArwQAIe0DAgCHBQAh7gMBALEEACED1AMAABAAINUDAAAQACDWAwAAEAAgDgQAALYFACAFAAC3BQAgCgAAuAUAIAsAAKMFACAMAAC5BQAg0gIAALUFADDTAgAABwAQ1AIAALUFADDVAgIArwQAIdYCAQCwBAAh3QJAALMEACGKA0AAswQAIeUDAQCwBAAh7wMCAIcFACEQBAAAtgUAIAUAALcFACAKAAC4BQAgCwAAowUAIAwAALkFACDSAgAAtQUAMNMCAAAHABDUAgAAtQUAMNUCAgCvBAAh1gIBALAEACHdAkAAswQAIYoDQACzBAAh5QMBALAEACHvAwIAhwUAIfYDAAAHACD3AwAABwAgA9QDAAAHACDVAwAABwAg1gMAAAcAIAPUAwAADAAg1QMAAAwAINYDAAAMACAD1AMAABYAINUDAAAWACDWAwAAFgAgEwMAALsFACAGAACwBQAgDgAAvAUAINICAAC6BQAw0wIAAAMAENQCAAC6BQAw1QICAK8EACHdAkAAswQAIesCAQCwBAAhigNAALMEACG6AwIArwQAIdgDAQCwBAAh2gMBALEEACHbAyAAsgQAIeEDQACTBQAh5QMBALAEACHoAwIArwQAIeoDAQCwBAAh6wMCAK8EACEYCwAAowUAIBEAAKAFACAdAACkBQAgHgAApQUAIB8AAKYFACAgAACWBQAgIQAApwUAINICAAChBQAw0wIAACcAENQCAAChBQAw1QICAK8EACHWAgEAsAQAIdcCAQCwBAAh2gIBALEEACHdAkAAswQAIYoDQACzBAAhpAMBALEEACGlA0AAkwUAIfADAQCwBAAh8QMBALEEACHzAwAAogXzAyL0A0AAkwUAIfYDAAAnACD3AwAAJwAgA9QDAAAeACDVAwAAHgAg1gMAAB4AIAAAAAAAAAH8AwEAAAABAfwDAQAAAAEB_AMgAAAAAQH8A0AAAAABBfwDAgAAAAGCBAIAAAABgwQCAAAAAYQEAgAAAAGFBAIAAAABAekCAQAAAAEAAAAAAAH8AwAAAO0CAgH8AwAAAO8CAwX8AwIAAAABggQCAAAAAYMEAgAAAAGEBAIAAAABhQQCAAAAAQcsAACgCgAgLQAAowoAIPkDAAChCgAg-gMAAKIKACD9AwAAJwAg_gMAACcAIP8DAAABACADLAAAoAoAIPkDAAChCgAg_wMAAAEAIAAAAAAAAfwDAAAA8wIDBfwDEAAAAAGCBBAAAAABgwQQAAAAAYQEEAAAAAGFBBAAAAABBywAAJgKACAtAACeCgAg-QMAAJkKACD6AwAAnQoAIP0DAABEACD-AwAARAAg_wMAAEYAIAcsAACWCgAgLQAAmwoAIPkDAACXCgAg-gMAAJoKACD9AwAAJwAg_gMAACcAIP8DAAABACADLAAAmAoAIPkDAACZCgAg_wMAAEYAIAMsAACWCgAg-QMAAJcKACD_AwAAAQAgAAAAAAAF_AMQAAAAAYIEEAAAAAGDBBAAAAABhAQQAAAAAYUEEAAAAAEB_AMAAACAAwIB_AMAAADzAgIB_ANAAAAAAQcsAACNCgAgLQAAlAoAIPkDAACOCgAg-gMAAJMKACD9AwAAIwAg_gMAACMAIP8DAAAlACAHLAAAiwoAIC0AAJEKACD5AwAAjAoAIPoDAACQCgAg_QMAACcAIP4DAAAnACD_AwAAAQAgCywAAOoFADAtAADvBQAw-QMAAOsFADD6AwAA7AUAMPsDAADtBQAg_AMAAO4FADD9AwAA7gUAMP4DAADuBQAw_wMAAO4FADCABAAA8AUAMIEEAADxBQAwChQAAN0FACDVAgIAAAAB8wIAAADzAgP0AgAAAPMCA_UCEAAAAAH2AgEAAAAB9wICAAAAAfgCQAAAAAH5AhAAAAAB-gIQAAAAAQIAAABMACAsAAD1BQAgAwAAAEwAICwAAPUFACAtAAD0BQAgAScAAI8KADAPFAAAigUAIBoAAI4FACDSAgAAiwUAMNMCAABKABDUAgAAiwUAMNUCAgAAAAHxAgIAhwUAIfMCAACMBfMCI_QCAACMBfMCI_UCEACNBQAh9gIBALEEACH3AgIAhwUAIfgCQACzBAAh-QIQAI0FACH6AhAAjQUAIQIAAABMACAnAAD0BQAgAgAAAPIFACAnAADzBQAgDdICAADxBQAw0wIAAPIFABDUAgAA8QUAMNUCAgCvBAAh8QICAIcFACHzAgAAjAXzAiP0AgAAjAXzAiP1AhAAjQUAIfYCAQCxBAAh9wICAIcFACH4AkAAswQAIfkCEACNBQAh-gIQAI0FACEN0gIAAPEFADDTAgAA8gUAENQCAADxBQAw1QICAK8EACHxAgIAhwUAIfMCAACMBfMCI_QCAACMBfMCI_UCEACNBQAh9gIBALEEACH3AgIAhwUAIfgCQACzBAAh-QIQAI0FACH6AhAAjQUAIQnVAgIAxwUAIfMCAADYBfMCI_QCAADYBfMCI_UCEADZBQAh9gIBAMQFACH3AgIA0AUAIfgCQADGBQAh-QIQANkFACH6AhAA2QUAIQoUAADbBQAg1QICAMcFACHzAgAA2AXzAiP0AgAA2AXzAiP1AhAA2QUAIfYCAQDEBQAh9wICANAFACH4AkAAxgUAIfkCEADZBQAh-gIQANkFACEKFAAA3QUAINUCAgAAAAHzAgAAAPMCA_QCAAAA8wID9QIQAAAAAfYCAQAAAAH3AgIAAAAB-AJAAAAAAfkCEAAAAAH6AhAAAAABAywAAI0KACD5AwAAjgoAIP8DAAAlACADLAAAiwoAIPkDAACMCgAg_wMAAAEAIAQsAADqBQAw-QMAAOsFADD7AwAA7QUAIP8DAADuBQAwAAAAAAAB_AMAAACYAwIHLAAAhgoAIC0AAIkKACD5AwAAhwoAIPoDAACICgAg_QMAACMAIP4DAAAjACD_AwAAJQAgAywAAIYKACD5AwAAhwoAIP8DAAAlACAAAAAAAAH8AwAAAJoDAgcsAAD-CQAgLQAAhAoAIPkDAAD_CQAg-gMAAIMKACD9AwAAIwAg_gMAACMAIP8DAAAlACAHLAAA_AkAIC0AAIEKACD5AwAA_QkAIPoDAACACgAg_QMAACcAIP4DAAAnACD_AwAAAQAgAywAAP4JACD5AwAA_wkAIP8DAAAlACADLAAA_AkAIPkDAAD9CQAg_wMAAAEAIAAAAAAAAfwDAAAAmgMDBywAAPQJACAtAAD6CQAg-QMAAPUJACD6AwAA-QkAIP0DAAAjACD-AwAAIwAg_wMAACUAIAcsAADyCQAgLQAA9wkAIPkDAADzCQAg-gMAAPYJACD9AwAAJwAg_gMAACcAIP8DAAABACADLAAA9AkAIPkDAAD1CQAg_wMAACUAIAMsAADyCQAg-QMAAPMJACD_AwAAAQAgAAAAAAAB_AMAAACjAwMHLAAA5gkAIC0AAPAJACD5AwAA5wkAIPoDAADvCQAg_QMAACcAIP4DAAAnACD_AwAAAQAgBywAAOQJACAtAADtCQAg-QMAAOUJACD6AwAA7AkAIP0DAAApACD-AwAAKQAg_wMAAC4AIAssAADFBgAwLQAAygYAMPkDAADGBgAw-gMAAMcGADD7AwAAyAYAIPwDAADJBgAw_QMAAMkGADD-AwAAyQYAMP8DAADJBgAwgAQAAMsGADCBBAAAzAYAMAssAAC5BgAwLQAAvgYAMPkDAAC6BgAw-gMAALsGADD7AwAAvAYAIPwDAAC9BgAw_QMAAL0GADD-AwAAvQYAMP8DAAC9BgAwgAQAAL8GADCBBAAAwAYAMAssAACtBgAwLQAAsgYAMPkDAACuBgAw-gMAAK8GADD7AwAAsAYAIPwDAACxBgAw_QMAALEGADD-AwAAsQYAMP8DAACxBgAwgAQAALMGADCBBAAAtAYAMAssAAChBgAwLQAApgYAMPkDAACiBgAw-gMAAKMGADD7AwAApAYAIPwDAAClBgAw_QMAAKUGADD-AwAApQYAMP8DAAClBgAwgAQAAKcGADCBBAAAqAYAMBgZAAD3BQAgGwAA-AUAINUCAgAAAAHdAkAAAAAB9gIBAAAAAfwCAQAAAAH9AhAAAAAB_gIQAAAAAYADAAAAgAMCgQMBAAAAAYIDAQAAAAGDAwAAAPMCAoQDQAAAAAGFAwEAAAABhgNAAAAAAYcDAgAAAAGIA0AAAAABiQMBAAAAAYoDQAAAAAGLAyAAAAABjAOAAAAAAY0DAgAAAAGOA0AAAAABjwNAAAAAAQIAAABGACAsAACsBgAgAwAAAEYAICwAAKwGACAtAACrBgAgAScAAOsJADAdEwAAlQUAIBkAAIoFACAbAACWBQAg0gIAAI8FADDTAgAARAAQ1AIAAI8FADDVAgIAAAAB3QJAALMEACH2AgEAsQQAIfsCAgCHBQAh_AIBAAAAAf0CEACQBQAh_gIQAJAFACGAAwAAkQWAAyKBAwEAsQQAIYIDAQCxBAAhgwMAAJIF8wIihANAAJMFACGFAwEAsQQAIYYDQACTBQAhhwMCAIcFACGIA0AAkwUAIYkDAQAAAAGKA0AAswQAIYsDIACyBAAhjAMAAJQFACCNAwIArwQAIY4DQACTBQAhjwNAAJMFACECAAAARgAgJwAAqwYAIAIAAACpBgAgJwAAqgYAIBrSAgAAqAYAMNMCAACpBgAQ1AIAAKgGADDVAgIArwQAId0CQACzBAAh9gIBALEEACH7AgIAhwUAIfwCAQCwBAAh_QIQAJAFACH-AhAAkAUAIYADAACRBYADIoEDAQCxBAAhggMBALEEACGDAwAAkgXzAiKEA0AAkwUAIYUDAQCxBAAhhgNAAJMFACGHAwIAhwUAIYgDQACTBQAhiQMBALEEACGKA0AAswQAIYsDIACyBAAhjAMAAJQFACCNAwIArwQAIY4DQACTBQAhjwNAAJMFACEa0gIAAKgGADDTAgAAqQYAENQCAACoBgAw1QICAK8EACHdAkAAswQAIfYCAQCxBAAh-wICAIcFACH8AgEAsAQAIf0CEACQBQAh_gIQAJAFACGAAwAAkQWAAyKBAwEAsQQAIYIDAQCxBAAhgwMAAJIF8wIihANAAJMFACGFAwEAsQQAIYYDQACTBQAhhwMCAIcFACGIA0AAkwUAIYkDAQCxBAAhigNAALMEACGLAyAAsgQAIYwDAACUBQAgjQMCAK8EACGOA0AAkwUAIY8DQACTBQAhFtUCAgDHBQAh3QJAAMYFACH2AgEAxAUAIfwCAQDDBQAh_QIQAOMFACH-AhAA4wUAIYADAADkBYADIoEDAQDEBQAhggMBAMQFACGDAwAA5QXzAiKEA0AA5gUAIYUDAQDEBQAhhgNAAOYFACGHAwIA0AUAIYgDQADmBQAhiQMBAMQFACGKA0AAxgUAIYsDIADFBQAhjAOAAAAAAY0DAgDHBQAhjgNAAOYFACGPA0AA5gUAIRgZAADoBQAgGwAA6QUAINUCAgDHBQAh3QJAAMYFACH2AgEAxAUAIfwCAQDDBQAh_QIQAOMFACH-AhAA4wUAIYADAADkBYADIoEDAQDEBQAhggMBAMQFACGDAwAA5QXzAiKEA0AA5gUAIYUDAQDEBQAhhgNAAOYFACGHAwIA0AUAIYgDQADmBQAhiQMBAMQFACGKA0AAxgUAIYsDIADFBQAhjAOAAAAAAY0DAgDHBQAhjgNAAOYFACGPA0AA5gUAIRgZAAD3BQAgGwAA-AUAINUCAgAAAAHdAkAAAAAB9gIBAAAAAfwCAQAAAAH9AhAAAAAB_gIQAAAAAYADAAAAgAMCgQMBAAAAAYIDAQAAAAGDAwAAAPMCAoQDQAAAAAGFAwEAAAABhgNAAAAAAYcDAgAAAAGIA0AAAAABiQMBAAAAAYoDQAAAAAGLAyAAAAABjAOAAAAAAY0DAgAAAAGOA0AAAAABjwNAAAAAAQfVAgIAAAAB3QJAAAAAAfYCAQAAAAGDAwAAAJgDAooDQAAAAAGWAwEAAAABmANAAAAAAQIAAABBACAsAAC4BgAgAwAAAEEAICwAALgGACAtAAC3BgAgAScAAOoJADAMEwAAlQUAINICAACXBQAw0wIAAD8AENQCAACXBQAw1QICAAAAAd0CQACzBAAh9gIBALEEACH7AgIAhwUAIYMDAACYBZgDIooDQACzBAAhlgMBALEEACGYA0AAkwUAIQIAAABBACAnAAC3BgAgAgAAALUGACAnAAC2BgAgC9ICAAC0BgAw0wIAALUGABDUAgAAtAYAMNUCAgCvBAAh3QJAALMEACH2AgEAsQQAIfsCAgCHBQAhgwMAAJgFmAMiigNAALMEACGWAwEAsQQAIZgDQACTBQAhC9ICAAC0BgAw0wIAALUGABDUAgAAtAYAMNUCAgCvBAAh3QJAALMEACH2AgEAsQQAIfsCAgCHBQAhgwMAAJgFmAMiigNAALMEACGWAwEAsQQAIZgDQACTBQAhB9UCAgDHBQAh3QJAAMYFACH2AgEAxAUAIYMDAAD-BZgDIooDQADGBQAhlgMBAMQFACGYA0AA5gUAIQfVAgIAxwUAId0CQADGBQAh9gIBAMQFACGDAwAA_gWYAyKKA0AAxgUAIZYDAQDEBQAhmANAAOYFACEH1QICAAAAAd0CQAAAAAH2AgEAAAABgwMAAACYAwKKA0AAAAABlgMBAAAAAZgDQAAAAAEIFgAAigYAINUCAgAAAAHdAkAAAAAB9gIBAAAAAYMDAAAAmgMCigNAAAAAAZoDAgAAAAGbA0AAAAABAgAAADsAICwAAMQGACADAAAAOwAgLAAAxAYAIC0AAMMGACABJwAA6QkAMA0TAACVBQAgFgAAigUAINICAACZBQAw0wIAADkAENQCAACZBQAw1QICAAAAAd0CQACzBAAh9gIBALEEACH7AgIAhwUAIYMDAACaBZoDIooDQACzBAAhmgMCAIcFACGbA0AAkwUAIQIAAAA7ACAnAADDBgAgAgAAAMEGACAnAADCBgAgC9ICAADABgAw0wIAAMEGABDUAgAAwAYAMNUCAgCvBAAh3QJAALMEACH2AgEAsQQAIfsCAgCHBQAhgwMAAJoFmgMiigNAALMEACGaAwIAhwUAIZsDQACTBQAhC9ICAADABgAw0wIAAMEGABDUAgAAwAYAMNUCAgCvBAAh3QJAALMEACH2AgEAsQQAIfsCAgCHBQAhgwMAAJoFmgMiigNAALMEACGaAwIAhwUAIZsDQACTBQAhB9UCAgDHBQAh3QJAAMYFACH2AgEAxAUAIYMDAACGBpoDIooDQADGBQAhmgMCANAFACGbA0AA5gUAIQgWAACIBgAg1QICAMcFACHdAkAAxgUAIfYCAQDEBQAhgwMAAIYGmgMiigNAAMYFACGaAwIA0AUAIZsDQADmBQAhCBYAAIoGACDVAgIAAAAB3QJAAAAAAfYCAQAAAAGDAwAAAJoDAooDQAAAAAGaAwIAAAABmwNAAAAAAQcUAACUBgAg1QICAAAAAfMCAAAAmgMD9AIAAACaAwP2AgEAAAAB9wICAAAAAfgCQAAAAAECAAAANQAgLAAA0AYAIAMAAAA1ACAsAADQBgAgLQAAzwYAIAEnAADoCQAwDBMAAJUFACAUAACKBQAg0gIAAJsFADDTAgAAMwAQ1AIAAJsFADDVAgIAAAAB8wIAAJwFmgMj9AIAAJwFmgMj9gIBALEEACH3AgIAhwUAIfgCQACzBAAh-wICAIcFACECAAAANQAgJwAAzwYAIAIAAADNBgAgJwAAzgYAIArSAgAAzAYAMNMCAADNBgAQ1AIAAMwGADDVAgIArwQAIfMCAACcBZoDI_QCAACcBZoDI_YCAQCxBAAh9wICAIcFACH4AkAAswQAIfsCAgCHBQAhCtICAADMBgAw0wIAAM0GABDUAgAAzAYAMNUCAgCvBAAh8wIAAJwFmgMj9AIAAJwFmgMj9gIBALEEACH3AgIAhwUAIfgCQACzBAAh-wICAIcFACEG1QICAMcFACHzAgAAkAaaAyP0AgAAkAaaAyP2AgEAxAUAIfcCAgDQBQAh-AJAAMYFACEHFAAAkgYAINUCAgDHBQAh8wIAAJAGmgMj9AIAAJAGmgMj9gIBAMQFACH3AgIA0AUAIfgCQADGBQAhBxQAAJQGACDVAgIAAAAB8wIAAACaAwP0AgAAAJoDA_YCAQAAAAH3AgIAAAAB-AJAAAAAAQMsAADmCQAg-QMAAOcJACD_AwAAAQAgAywAAOQJACD5AwAA5QkAIP8DAAAuACAELAAAxQYAMPkDAADGBgAw-wMAAMgGACD_AwAAyQYAMAQsAAC5BgAw-QMAALoGADD7AwAAvAYAIP8DAAC9BgAwBCwAAK0GADD5AwAArgYAMPsDAACwBgAg_wMAALEGADAELAAAoQYAMPkDAACiBgAw-wMAAKQGACD_AwAApQYAMAAAAAAAAfwDAAAAwwMCBywAAN4JACAtAADiCQAg-QMAAN8JACD6AwAA4QkAIP0DAAArACD-AwAAKwAg_wMAAM8CACALLAAA3wYAMC0AAOQGADD5AwAA4AYAMPoDAADhBgAw-wMAAOIGACD8AwAA4wYAMP0DAADjBgAw_gMAAOMGADD_AwAA4wYAMIAEAADlBgAwgQQAAOYGADAkDwAA0QYAIBUAANMGACAXAADUBgAgGAAA1QYAIBwAANYGACDVAgIAAAAB6gICAAAAAYoDQAAAAAGdAwAAAJoDAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDAQAAAAGjAwAAAKMDA6QDAQAAAAGlA0AAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrAwEAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAECAAAAJQAgLAAA6gYAIAMAAAAlACAsAADqBgAgLQAA6QYAIAEnAADgCQAwKg8AAIoFACASAACrBQAgFQAApAUAIBcAAKUFACAYAACsBQAgHAAApgUAINICAACpBQAw0wIAACMAENQCAACpBQAw1QICAAAAAeoCAgCHBQAhigNAALMEACGcAwIAhwUAIZ0DAACaBZoDIp4DAQAAAAGfAwEAsQQAIaADQACzBAAhoQMBALEEACGjAwAAqgWjAyOkAwEAsQQAIaUDQACTBQAhpgMBALEEACGnAwEAsQQAIagDAQCxBAAhqQMBALEEACGqAwEAsQQAIasDAQCxBAAhrAMBALEEACGtAwEAsQQAIa4DAQCxBAAhrwMBALEEACGwAwEAsQQAIbEDAQCxBAAhsgMBALEEACGzAwEAsQQAIbQDAQCxBAAhtQMBALEEACG2AwEAsQQAIbcDAQCxBAAhuAMBALEEACG5AwEAsQQAIfUDAACoBQAgAgAAACUAICcAAOkGACACAAAA5wYAICcAAOgGACAj0gIAAOYGADDTAgAA5wYAENQCAADmBgAw1QICAK8EACHqAgIAhwUAIYoDQACzBAAhnAMCAIcFACGdAwAAmgWaAyKeAwEAsAQAIZ8DAQCxBAAhoANAALMEACGhAwEAsQQAIaMDAACqBaMDI6QDAQCxBAAhpQNAAJMFACGmAwEAsQQAIacDAQCxBAAhqAMBALEEACGpAwEAsQQAIaoDAQCxBAAhqwMBALEEACGsAwEAsQQAIa0DAQCxBAAhrgMBALEEACGvAwEAsQQAIbADAQCxBAAhsQMBALEEACGyAwEAsQQAIbMDAQCxBAAhtAMBALEEACG1AwEAsQQAIbYDAQCxBAAhtwMBALEEACG4AwEAsQQAIbkDAQCxBAAhI9ICAADmBgAw0wIAAOcGABDUAgAA5gYAMNUCAgCvBAAh6gICAIcFACGKA0AAswQAIZwDAgCHBQAhnQMAAJoFmgMingMBALAEACGfAwEAsQQAIaADQACzBAAhoQMBALEEACGjAwAAqgWjAyOkAwEAsQQAIaUDQACTBQAhpgMBALEEACGnAwEAsQQAIagDAQCxBAAhqQMBALEEACGqAwEAsQQAIasDAQCxBAAhrAMBALEEACGtAwEAsQQAIa4DAQCxBAAhrwMBALEEACGwAwEAsQQAIbEDAQCxBAAhsgMBALEEACGzAwEAsQQAIbQDAQCxBAAhtQMBALEEACG2AwEAsQQAIbcDAQCxBAAhuAMBALEEACG5AwEAsQQAIR_VAgIAxwUAIeoCAgDQBQAhigNAAMYFACGdAwAAhgaaAyKeAwEAwwUAIZ8DAQDEBQAhoANAAMYFACGhAwEAxAUAIaMDAACaBqMDI6QDAQDEBQAhpQNAAOYFACGmAwEAxAUAIacDAQDEBQAhqAMBAMQFACGpAwEAxAUAIaoDAQDEBQAhqwMBAMQFACGsAwEAxAUAIa0DAQDEBQAhrgMBAMQFACGvAwEAxAUAIbADAQDEBQAhsQMBAMQFACGyAwEAxAUAIbMDAQDEBQAhtAMBAMQFACG1AwEAxAUAIbYDAQDEBQAhtwMBAMQFACG4AwEAxAUAIbkDAQDEBQAhJA8AAJsGACAVAACdBgAgFwAAngYAIBgAAJ8GACAcAACgBgAg1QICAMcFACHqAgIA0AUAIYoDQADGBQAhnQMAAIYGmgMingMBAMMFACGfAwEAxAUAIaADQADGBQAhoQMBAMQFACGjAwAAmgajAyOkAwEAxAUAIaUDQADmBQAhpgMBAMQFACGnAwEAxAUAIagDAQDEBQAhqQMBAMQFACGqAwEAxAUAIasDAQDEBQAhrAMBAMQFACGtAwEAxAUAIa4DAQDEBQAhrwMBAMQFACGwAwEAxAUAIbEDAQDEBQAhsgMBAMQFACGzAwEAxAUAIbQDAQDEBQAhtQMBAMQFACG2AwEAxAUAIbcDAQDEBQAhuAMBAMQFACG5AwEAxAUAISQPAADRBgAgFQAA0wYAIBcAANQGACAYAADVBgAgHAAA1gYAINUCAgAAAAHqAgIAAAABigNAAAAAAZ0DAAAAmgMCngMBAAAAAZ8DAQAAAAGgA0AAAAABoQMBAAAAAaMDAAAAowMDpAMBAAAAAaUDQAAAAAGmAwEAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4AwEAAAABuQMBAAAAAQMsAADeCQAg-QMAAN8JACD_AwAAzwIAIAQsAADfBgAw-QMAAOAGADD7AwAA4gYAIP8DAADjBgAwAAAAAAALLAAA8wYAMC0AAPgGADD5AwAA9AYAMPoDAAD1BgAw-wMAAPYGACD8AwAA9wYAMP0DAAD3BgAw_gMAAPcGADD_AwAA9wYAMIAEAAD5BgAwgQQAAPoGADAeEQAA7AYAINUCAgAAAAHWAgEAAAAB3QJAAAAAAYMDAAAAwwMCigNAAAAAAbsDAQAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_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_AwEAAAABwAMCAAAAAcEDAgAAAAHDAyAAAAABxAMBAAAAAcUDQAAAAAHGA0AAAAABxwNAAAAAAcgDAQAAAAHJAxAAAAABygMBAAAAAcsDEAAAAAHMAwEAAAABzQMBAAAAAc4DEAAAAAHPAxAAAAAB0AMBAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAQQsAADzBgAw-QMAAPQGADD7AwAA9gYAIP8DAAD3BgAwAAHpAgEAAAABAAAAAAAB6QIBAAAAAQAAAAAAAfwDAAAA3QMCAekCAQAAAAEAAAAAAAUsAADYCQAgLQAA2wkAIPkDAADZCQAg-gMAANoJACD_AwAACgAgAywAANgJACD5AwAA2QkAIP8DAAAKACAAAAAAAAUsAADTCQAgLQAA1gkAIPkDAADUCQAg-gMAANUJACD_AwAA3QEAIAMsAADTCQAg-QMAANQJACD_AwAA3QEAIAAAAAAACywAAKMHADAtAACoBwAw-QMAAKQHADD6AwAApQcAMPsDAACmBwAg_AMAAKcHADD9AwAApwcAMP4DAACnBwAw_wMAAKcHADCABAAAqQcAMIEEAACqBwAwBdUCAgAAAAHdAkAAAAABigNAAAAAAeMDAQAAAAHkAwEAAAABAgAAAOEBACAsAACuBwAgAwAAAOEBACAsAACuBwAgLQAArQcAIAEnAADSCQAwCn4AAPwEACDSAgAA-wQAMNMCAADfAQAQ1AIAAPsEADDVAgIAAAAB3QJAALMEACGKA0AAswQAIeIDAgCvBAAh4wMBALAEACHkAwEAsAQAIQIAAADhAQAgJwAArQcAIAIAAACrBwAgJwAArAcAIAnSAgAAqgcAMNMCAACrBwAQ1AIAAKoHADDVAgIArwQAId0CQACzBAAhigNAALMEACHiAwIArwQAIeMDAQCwBAAh5AMBALAEACEJ0gIAAKoHADDTAgAAqwcAENQCAACqBwAw1QICAK8EACHdAkAAswQAIYoDQACzBAAh4gMCAK8EACHjAwEAsAQAIeQDAQCwBAAhBdUCAgDHBQAh3QJAAMYFACGKA0AAxgUAIeMDAQDDBQAh5AMBAMMFACEF1QICAMcFACHdAkAAxgUAIYoDQADGBQAh4wMBAMMFACHkAwEAwwUAIQXVAgIAAAAB3QJAAAAAAYoDQAAAAAHjAwEAAAAB5AMBAAAAAQQsAACjBwAw-QMAAKQHADD7AwAApgcAIP8DAACnBwAwAAHpAgEAAAABA38AALAHACDmAwAAvQUAIPgDAACxBwAgAekCAQAAAAEAAAAAAAUsAADNCQAgLQAA0AkAIPkDAADOCQAg-gMAAM8JACD_AwAABQAgAywAAM0JACD5AwAAzgkAIP8DAAAFACAAAAAAAAUsAADECQAgLQAAywkAIPkDAADFCQAg-gMAAMoJACD_AwAAAQAgBSwAAMIJACAtAADICQAg-QMAAMMJACD6AwAAxwkAIP8DAAAKACALLAAAwwcAMC0AAMgHADD5AwAAxAcAMPoDAADFBwAw-wMAAMYHACD8AwAAxwcAMP0DAADHBwAw_gMAAMcHADD_AwAAxwcAMIAEAADJBwAwgQQAAMoHADAF1QICAAAAAd0CQAAAAAGKA0AAAAAB4wMBAAAAAeQDAQAAAAECAAAAIAAgLAAAzgcAIAMAAAAgACAsAADOBwAgLQAAzQcAIAEnAADGCQAwCg0AAK4FACDSAgAArQUAMNMCAAAeABDUAgAArQUAMNUCAgAAAAHdAkAAswQAIYoDQACzBAAh4wMBALAEACHkAwEAsAQAIekDAgCvBAAhAgAAACAAICcAAM0HACACAAAAywcAICcAAMwHACAJ0gIAAMoHADDTAgAAywcAENQCAADKBwAw1QICAK8EACHdAkAAswQAIYoDQACzBAAh4wMBALAEACHkAwEAsAQAIekDAgCvBAAhCdICAADKBwAw0wIAAMsHABDUAgAAygcAMNUCAgCvBAAh3QJAALMEACGKA0AAswQAIeMDAQCwBAAh5AMBALAEACHpAwIArwQAIQXVAgIAxwUAId0CQADGBQAhigNAAMYFACHjAwEAwwUAIeQDAQDDBQAhBdUCAgDHBQAh3QJAAMYFACGKA0AAxgUAIeMDAQDDBQAh5AMBAMMFACEF1QICAAAAAd0CQAAAAAGKA0AAAAAB4wMBAAAAAeQDAQAAAAEDLAAAxAkAIPkDAADFCQAg_wMAAAEAIAMsAADCCQAg-QMAAMMJACD_AwAACgAgBCwAAMMHADD5AwAAxAcAMPsDAADGBwAg_wMAAMcHADAAAAAAAAUsAAC9CQAgLQAAwAkAIPkDAAC-CQAg-gMAAL8JACD_AwAADgAgAywAAL0JACD5AwAAvgkAIP8DAAAOACAAAAAAAAUsAAC3CQAgLQAAuwkAIPkDAAC4CQAg-gMAALoJACD_AwAACgAgCywAAOAHADAtAADlBwAw-QMAAOEHADD6AwAA4gcAMPsDAADjBwAg_AMAAOQHADD9AwAA5AcAMP4DAADkBwAw_wMAAOQHADCABAAA5gcAMIEEAADnBwAwBdUCAgAAAAHdAkAAAAABigNAAAAAAeMDAQAAAAHkAwEAAAABAgAAABIAICwAAOsHACADAAAAEgAgLAAA6wcAIC0AAOoHACABJwAAuQkAMAoHAACyBQAg0gIAALEFADDTAgAAEAAQ1AIAALEFADDVAgIAAAAB3QJAALMEACGKA0AAswQAIeMDAQCwBAAh5AMBALAEACHsAwIArwQAIQIAAAASACAnAADqBwAgAgAAAOgHACAnAADpBwAgCdICAADnBwAw0wIAAOgHABDUAgAA5wcAMNUCAgCvBAAh3QJAALMEACGKA0AAswQAIeMDAQCwBAAh5AMBALAEACHsAwIArwQAIQnSAgAA5wcAMNMCAADoBwAQ1AIAAOcHADDVAgIArwQAId0CQACzBAAhigNAALMEACHjAwEAsAQAIeQDAQCwBAAh7AMCAK8EACEF1QICAMcFACHdAkAAxgUAIYoDQADGBQAh4wMBAMMFACHkAwEAwwUAIQXVAgIAxwUAId0CQADGBQAhigNAAMYFACHjAwEAwwUAIeQDAQDDBQAhBdUCAgAAAAHdAkAAAAABigNAAAAAAeMDAQAAAAHkAwEAAAABAywAALcJACD5AwAAuAkAIP8DAAAKACAELAAA4AcAMPkDAADhBwAw-wMAAOMHACD_AwAA5AcAMAAAAAAABywAAK4JACAtAAC1CQAg-QMAAK8JACD6AwAAtAkAIP0DAAAHACD-AwAABwAg_wMAAAoAIAssAACcCAAwLQAAoQgAMPkDAACdCAAw-gMAAJ4IADD7AwAAnwgAIPwDAACgCAAw_QMAAKAIADD-AwAAoAgAMP8DAACgCAAwgAQAAKIIADCBBAAAowgAMAssAACQCAAwLQAAlQgAMPkDAACRCAAw-gMAAJIIADD7AwAAkwgAIPwDAACUCAAw_QMAAJQIADD-AwAAlAgAMP8DAACUCAAwgAQAAJYIADCBBAAAlwgAMAssAACECAAwLQAAiQgAMPkDAACFCAAw-gMAAIYIADD7AwAAhwgAIPwDAACICAAw_QMAAIgIADD-AwAAiAgAMP8DAACICAAwgAQAAIoIADCBBAAAiwgAMAssAAD4BwAwLQAA_QcAMPkDAAD5BwAw-gMAAPoHADD7AwAA-wcAIPwDAAD8BwAw_QMAAPwHADD-AwAA_AcAMP8DAAD8BwAwgAQAAP4HADCBBAAA_wcAMAnVAgIAAAAB3QJAAAAAAesCAQAAAAGKA0AAAAABvAMBAAAAAdoDAQAAAAHbAyAAAAAB3wMCAAAAAeEDQAAAAAECAAAAGAAgLAAAgwgAIAMAAAAYACAsAACDCAAgLQAAgggAIAEnAACzCQAwDgYAALAFACDSAgAArwUAMNMCAAAWABDUAgAArwUAMNUCAgAAAAHdAkAAswQAIesCAQCwBAAhigNAALMEACG6AwIArwQAIbwDAQCxBAAh2gMBALAEACHbAyAAsgQAId8DAgCvBAAh4QNAAJMFACECAAAAGAAgJwAAgggAIAIAAACACAAgJwAAgQgAIA3SAgAA_wcAMNMCAACACAAQ1AIAAP8HADDVAgIArwQAId0CQACzBAAh6wIBALAEACGKA0AAswQAIboDAgCvBAAhvAMBALEEACHaAwEAsAQAIdsDIACyBAAh3wMCAK8EACHhA0AAkwUAIQ3SAgAA_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-wMAAJ8IACD_AwAAoAgAMAQsAACQCAAw-QMAAJEIADD7AwAAkwgAIP8DAACUCAAwBCwAAIQIADD5AwAAhQgAMPsDAACHCAAg_wMAAIgIADAELAAA-AcAMPkDAAD5BwAw-wMAAPsHACD_AwAA_AcAMAMsAACuCQAg-QMAAK8JACD_AwAACgAgAAAAAAAB_AMAAADzAwILLAAA8wgAMC0AAPcIADD5AwAA9AgAMPoDAAD1CAAw-wMAAPYIACD8AwAAiAgAMP0DAACICAAw_gMAAIgIADD_AwAAiAgAMIAEAAD4CAAwgQQAAIsIADALLAAA6ggAMC0AAO4IADD5AwAA6wgAMPoDAADsCAAw-wMAAO0IACD8AwAA4wYAMP0DAADjBgAw_gMAAOMGADD_AwAA4wYAMIAEAADvCAAwgQQAAOYGADALLAAA4QgAMC0AAOUIADD5AwAA4ggAMPoDAADjCAAw-wMAAOQIACD8AwAAyQYAMP0DAADJBgAw_gMAAMkGADD_AwAAyQYAMIAEAADmCAAwgQQAAMwGADALLAAA2AgAMC0AANwIADD5AwAA2QgAMPoDAADaCAAw-wMAANsIACD8AwAAvQYAMP0DAAC9BgAw_gMAAL0GADD_AwAAvQYAMIAEAADdCAAwgQQAAMAGADALLAAAzwgAMC0AANMIADD5AwAA0AgAMPoDAADRCAAw-wMAANIIACD8AwAApQYAMP0DAAClBgAw_gMAAKUGADD_AwAApQYAMIAEAADUCAAwgQQAAKgGADALLAAAxggAMC0AAMoIADD5AwAAxwgAMPoDAADICAAw-wMAAMkIACD8AwAA7gUAMP0DAADuBQAw_gMAAO4FADD_AwAA7gUAMIAEAADLCAAwgQQAAPEFADALLAAAuggAMC0AAL8IADD5AwAAuwgAMPoDAAC8CAAw-wMAAL0IACD8AwAAvggAMP0DAAC-CAAw_gMAAL4IADD_AwAAvggAMIAEAADACAAwgQQAAMEIADAI1QICAAAAAdkCAQAAAAHcAiAAAAAB3QJAAAAAAesCAQAAAAHtAgAAAO0CAu8CAAAA7wID8AICAAAAAQIAAABbACAsAADFCAAgAwAAAFsAICwAAMUIACAtAADECAAgAScAAK0JADANDwAAigUAINICAACGBQAw0wIAAFkAENQCAACGBQAw1QICAAAAAdkCAQCwBAAh3AIgALIEACHdAkAAswQAIeoCAgCHBQAh6wIBALAEACHtAgAAiAXtAiLvAgAAiQXvAiPwAgIAhwUAIQIAAABbACAnAADECAAgAgAAAMIIACAnAADDCAAgDNICAADBCAAw0wIAAMIIABDUAgAAwQgAMNUCAgCvBAAh2QIBALAEACHcAiAAsgQAId0CQACzBAAh6gICAIcFACHrAgEAsAQAIe0CAACIBe0CIu8CAACJBe8CI_ACAgCHBQAhDNICAADBCAAw0wIAAMIIABDUAgAAwQgAMNUCAgCvBAAh2QIBALAEACHcAiAAsgQAId0CQACzBAAh6gICAIcFACHrAgEAsAQAIe0CAACIBe0CIu8CAACJBe8CI_ACAgCHBQAhCNUCAgDHBQAh2QIBAMMFACHcAiAAxQUAId0CQADGBQAh6wIBAMMFACHtAgAAzgXtAiLvAgAAzwXvAiPwAgIA0AUAIQjVAgIAxwUAIdkCAQDDBQAh3AIgAMUFACHdAkAAxgUAIesCAQDDBQAh7QIAAM4F7QIi7wIAAM8F7wIj8AICANAFACEI1QICAAAAAdkCAQAAAAHcAiAAAAAB3QJAAAAAAesCAQAAAAHtAgAAAO0CAu8CAAAA7wID8AICAAAAAQoaAADcBQAg1QICAAAAAfECAgAAAAHzAgAAAPMCA_QCAAAA8wID9QIQAAAAAfYCAQAAAAH4AkAAAAAB-QIQAAAAAfoCEAAAAAECAAAATAAgLAAAzggAIAMAAABMACAsAADOCAAgLQAAzQgAIAEnAACsCQAwAgAAAEwAICcAAM0IACACAAAA8gUAICcAAMwIACAJ1QICAMcFACHxAgIA0AUAIfMCAADYBfMCI_QCAADYBfMCI_UCEADZBQAh9gIBAMQFACH4AkAAxgUAIfkCEADZBQAh-gIQANkFACEKGgAA2gUAINUCAgDHBQAh8QICANAFACHzAgAA2AXzAiP0AgAA2AXzAiP1AhAA2QUAIfYCAQDEBQAh-AJAAMYFACH5AhAA2QUAIfoCEADZBQAhChoAANwFACDVAgIAAAAB8QICAAAAAfMCAAAA8wID9AIAAADzAgP1AhAAAAAB9gIBAAAAAfgCQAAAAAH5AhAAAAAB-gIQAAAAARgTAAD2BQAgGwAA-AUAINUCAgAAAAHdAkAAAAAB9gIBAAAAAfsCAgAAAAH8AgEAAAAB_QIQAAAAAf4CEAAAAAGAAwAAAIADAoEDAQAAAAGCAwEAAAABgwMAAADzAgKEA0AAAAABhQMBAAAAAYYDQAAAAAGIA0AAAAABiQMBAAAAAYoDQAAAAAGLAyAAAAABjAOAAAAAAY0DAgAAAAGOA0AAAAABjwNAAAAAAQIAAABGACAsAADXCAAgAwAAAEYAICwAANcIACAtAADWCAAgAScAAKsJADACAAAARgAgJwAA1ggAIAIAAACpBgAgJwAA1QgAIBbVAgIAxwUAId0CQADGBQAh9gIBAMQFACH7AgIA0AUAIfwCAQDDBQAh_QIQAOMFACH-AhAA4wUAIYADAADkBYADIoEDAQDEBQAhggMBAMQFACGDAwAA5QXzAiKEA0AA5gUAIYUDAQDEBQAhhgNAAOYFACGIA0AA5gUAIYkDAQDEBQAhigNAAMYFACGLAyAAxQUAIYwDgAAAAAGNAwIAxwUAIY4DQADmBQAhjwNAAOYFACEYEwAA5wUAIBsAAOkFACDVAgIAxwUAId0CQADGBQAh9gIBAMQFACH7AgIA0AUAIfwCAQDDBQAh_QIQAOMFACH-AhAA4wUAIYADAADkBYADIoEDAQDEBQAhggMBAMQFACGDAwAA5QXzAiKEA0AA5gUAIYUDAQDEBQAhhgNAAOYFACGIA0AA5gUAIYkDAQDEBQAhigNAAMYFACGLAyAAxQUAIYwDgAAAAAGNAwIAxwUAIY4DQADmBQAhjwNAAOYFACEYEwAA9gUAIBsAAPgFACDVAgIAAAAB3QJAAAAAAfYCAQAAAAH7AgIAAAAB_AIBAAAAAf0CEAAAAAH-AhAAAAABgAMAAACAAwKBAwEAAAABggMBAAAAAYMDAAAA8wIChANAAAAAAYUDAQAAAAGGA0AAAAABiANAAAAAAYkDAQAAAAGKA0AAAAABiwMgAAAAAYwDgAAAAAGNAwIAAAABjgNAAAAAAY8DQAAAAAEIEwAAiQYAINUCAgAAAAHdAkAAAAAB9gIBAAAAAfsCAgAAAAGDAwAAAJoDAooDQAAAAAGbA0AAAAABAgAAADsAICwAAOAIACADAAAAOwAgLAAA4AgAIC0AAN8IACABJwAAqgkAMAIAAAA7ACAnAADfCAAgAgAAAMEGACAnAADeCAAgB9UCAgDHBQAh3QJAAMYFACH2AgEAxAUAIfsCAgDQBQAhgwMAAIYGmgMiigNAAMYFACGbA0AA5gUAIQgTAACHBgAg1QICAMcFACHdAkAAxgUAIfYCAQDEBQAh-wICANAFACGDAwAAhgaaAyKKA0AAxgUAIZsDQADmBQAhCBMAAIkGACDVAgIAAAAB3QJAAAAAAfYCAQAAAAH7AgIAAAABgwMAAACaAwKKA0AAAAABmwNAAAAAAQcTAACTBgAg1QICAAAAAfMCAAAAmgMD9AIAAACaAwP2AgEAAAAB-AJAAAAAAfsCAgAAAAECAAAANQAgLAAA6QgAIAMAAAA1ACAsAADpCAAgLQAA6AgAIAEnAACpCQAwAgAAADUAICcAAOgIACACAAAAzQYAICcAAOcIACAG1QICAMcFACHzAgAAkAaaAyP0AgAAkAaaAyP2AgEAxAUAIfgCQADGBQAh-wICANAFACEHEwAAkQYAINUCAgDHBQAh8wIAAJAGmgMj9AIAAJAGmgMj9gIBAMQFACH4AkAAxgUAIfsCAgDQBQAhBxMAAJMGACDVAgIAAAAB8wIAAACaAwP0AgAAAJoDA_YCAQAAAAH4AkAAAAAB-wICAAAAASQSAADSBgAgFQAA0wYAIBcAANQGACAYAADVBgAgHAAA1gYAINUCAgAAAAGKA0AAAAABnAMCAAAAAZ0DAAAAmgMCngMBAAAAAZ8DAQAAAAGgA0AAAAABoQMBAAAAAaMDAAAAowMDpAMBAAAAAaUDQAAAAAGmAwEAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4AwEAAAABuQMBAAAAAQIAAAAlACAsAADyCAAgAwAAACUAICwAAPIIACAtAADxCAAgAScAAKgJADACAAAAJQAgJwAA8QgAIAIAAADnBgAgJwAA8AgAIB_VAgIAxwUAIYoDQADGBQAhnAMCANAFACGdAwAAhgaaAyKeAwEAwwUAIZ8DAQDEBQAhoANAAMYFACGhAwEAxAUAIaMDAACaBqMDI6QDAQDEBQAhpQNAAOYFACGmAwEAxAUAIacDAQDEBQAhqAMBAMQFACGpAwEAxAUAIaoDAQDEBQAhqwMBAMQFACGsAwEAxAUAIa0DAQDEBQAhrgMBAMQFACGvAwEAxAUAIbADAQDEBQAhsQMBAMQFACGyAwEAxAUAIbMDAQDEBQAhtAMBAMQFACG1AwEAxAUAIbYDAQDEBQAhtwMBAMQFACG4AwEAxAUAIbkDAQDEBQAhJBIAAJwGACAVAACdBgAgFwAAngYAIBgAAJ8GACAcAACgBgAg1QICAMcFACGKA0AAxgUAIZwDAgDQBQAhnQMAAIYGmgMingMBAMMFACGfAwEAxAUAIaADQADGBQAhoQMBAMQFACGjAwAAmgajAyOkAwEAxAUAIaUDQADmBQAhpgMBAMQFACGnAwEAxAUAIagDAQDEBQAhqQMBAMQFACGqAwEAxAUAIasDAQDEBQAhrAMBAMQFACGtAwEAxAUAIa4DAQDEBQAhrwMBAMQFACGwAwEAxAUAIbEDAQDEBQAhsgMBAMQFACGzAwEAxAUAIbQDAQDEBQAhtQMBAMQFACG2AwEAxAUAIbcDAQDEBQAhuAMBAMQFACG5AwEAxAUAISQSAADSBgAgFQAA0wYAIBcAANQGACAYAADVBgAgHAAA1gYAINUCAgAAAAGKA0AAAAABnAMCAAAAAZ0DAAAAmgMCngMBAAAAAZ8DAQAAAAGgA0AAAAABoQMBAAAAAaMDAAAAowMDpAMBAAAAAaUDQAAAAAGmAwEAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4AwEAAAABuQMBAAAAAQ4GAADQBwAgDgAA0QcAINUCAgAAAAHdAkAAAAAB6wIBAAAAAYoDQAAAAAG6AwIAAAAB2AMBAAAAAdoDAQAAAAHbAyAAAAAB4QNAAAAAAeUDAQAAAAHoAwIAAAAB6gMBAAAAAQIAAAAFACAsAAD7CAAgAwAAAAUAICwAAPsIACAtAAD6CAAgAScAAKcJADACAAAABQAgJwAA-ggAIAIAAACMCAAgJwAA-QgAIAzVAgIAxwUAId0CQADGBQAh6wIBAMMFACGKA0AAxgUAIboDAgDHBQAh2AMBAMMFACHaAwEAxAUAIdsDIADFBQAh4QNAAOYFACHlAwEAwwUAIegDAgDHBQAh6gMBAMMFACEOBgAAwQcAIA4AAMIHACDVAgIAxwUAId0CQADGBQAh6wIBAMMFACGKA0AAxgUAIboDAgDHBQAh2AMBAMMFACHaAwEAxAUAIdsDIADFBQAh4QNAAOYFACHlAwEAwwUAIegDAgDHBQAh6gMBAMMFACEOBgAA0AcAIA4AANEHACDVAgIAAAAB3QJAAAAAAesCAQAAAAGKA0AAAAABugMCAAAAAdgDAQAAAAHaAwEAAAAB2wMgAAAAAeEDQAAAAAHlAwEAAAAB6AMCAAAAAeoDAQAAAAEELAAA8wgAMPkDAAD0CAAw-wMAAPYIACD_AwAAiAgAMAQsAADqCAAw-QMAAOsIADD7AwAA7QgAIP8DAADjBgAwBCwAAOEIADD5AwAA4ggAMPsDAADkCAAg_wMAAMkGADAELAAA2AgAMPkDAADZCAAw-wMAANsIACD_AwAAvQYAMAQsAADPCAAw-QMAANAIADD7AwAA0ggAIP8DAAClBgAwBCwAAMYIADD5AwAAxwgAMPsDAADJCAAg_wMAAO4FADAELAAAuggAMPkDAAC7CAAw-wMAAL0IACD_AwAAvggAMAAAAAAAAAAB6QIBAAAAAQ0LAACDCQAgEQAAhAkAIB0AAIUJACAeAACGCQAgHwAAhwkAICAAAIgJACAhAACJCQAg2gIAAL0FACCkAwAAvQUAIKUDAAC9BQAg8QMAAL0FACD0AwAAvQUAIPgDAACKCQAgAekCAQAAAAEREwAAjwkAIBkAAIsJACAbAACICQAg9gIAAL0FACD7AgAAvQUAIIEDAAC9BQAgggMAAL0FACCEAwAAvQUAIIUDAAC9BQAghgMAAL0FACCHAwAAvQUAIIgDAAC9BQAgiQMAAL0FACCMAwAAvQUAII4DAAC9BQAgjwMAAL0FACD4AwAAkAkAIAHpAgEAAAABIg8AAIsJACASAACWCQAgFQAAhQkAIBcAAIYJACAYAACXCQAgHAAAhwkAIOoCAAC9BQAgnAMAAL0FACCfAwAAvQUAIKEDAAC9BQAgowMAAL0FACCkAwAAvQUAIKUDAAC9BQAgpgMAAL0FACCnAwAAvQUAIKgDAAC9BQAgqQMAAL0FACCqAwAAvQUAIKsDAAC9BQAgrAMAAL0FACCtAwAAvQUAIK4DAAC9BQAgrwMAAL0FACCwAwAAvQUAILEDAAC9BQAgsgMAAL0FACCzAwAAvQUAILQDAAC9BQAgtQMAAL0FACC2AwAAvQUAILcDAAC9BQAguAMAAL0FACC5AwAAvQUAIPgDAACYCQAgAekCAQAAAAEB6QIBAAAAAQHpAgEAAAABAekCAQAAAAEDEAAAgAcAILwDAAC9BQAg-AMAAIEHACAB6QIBAAAAARUGAACUCQAgEQAAhAkAILoDAAC9BQAguwMAAL0FACC8AwAAvQUAIL0DAAC9BQAgvgMAAL0FACC_AwAAvQUAIMADAAC9BQAgxAMAAL0FACDFAwAAvQUAIMYDAAC9BQAgxwMAAL0FACDIAwAAvQUAIMoDAAC9BQAgzAMAAL0FACDNAwAAvQUAINADAAC9BQAg0QMAAL0FACDSAwAAvQUAIPgDAACVCQAgAAHpAgEAAAABBgMAAIsJACAGAACbCQAgDgAApQkAINoDAAC9BQAg4QMAAL0FACD4AwAApgkAIAHpAgEAAAABBwQAAJsJACAFAAChCQAgCgAAogkAIAsAAIMJACAMAACjCQAg7wMAAL0FACD4AwAApAkAIAHpAgEAAAABBgYAAJsJACAIAACfCQAg2gMAAL0FACDtAwAAvQUAIO4DAAC9BQAg-AMAAKAJACAB6QIBAAAAAQAB6QIBAAAAAQAAAAHpAgEAAAABAAHpAgEAAAABDNUCAgAAAAHdAkAAAAAB6wIBAAAAAYoDQAAAAAG6AwIAAAAB2AMBAAAAAdoDAQAAAAHbAyAAAAAB4QNAAAAAAeUDAQAAAAHoAwIAAAAB6gMBAAAAAR_VAgIAAAABigNAAAAAAZwDAgAAAAGdAwAAAJoDAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDAQAAAAGjAwAAAKMDA6QDAQAAAAGlA0AAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrAwEAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAEG1QICAAAAAfMCAAAAmgMD9AIAAACaAwP2AgEAAAAB-AJAAAAAAfsCAgAAAAEH1QICAAAAAd0CQAAAAAH2AgEAAAAB-wICAAAAAYMDAAAAmgMCigNAAAAAAZsDQAAAAAEW1QICAAAAAd0CQAAAAAH2AgEAAAAB-wICAAAAAfwCAQAAAAH9AhAAAAAB_gIQAAAAAYADAAAAgAMCgQMBAAAAAYIDAQAAAAGDAwAAAPMCAoQDQAAAAAGFAwEAAAABhgNAAAAAAYgDQAAAAAGJAwEAAAABigNAAAAAAYsDIAAAAAGMA4AAAAABjQMCAAAAAY4DQAAAAAGPA0AAAAABCdUCAgAAAAHxAgIAAAAB8wIAAADzAgP0AgAAAPMCA_UCEAAAAAH2AgEAAAAB-AJAAAAAAfkCEAAAAAH6AhAAAAABCNUCAgAAAAHZAgEAAAAB3AIgAAAAAd0CQAAAAAHrAgEAAAAB7QIAAADtAgLvAgAAAO8CA_ACAgAAAAEKBAAArAgAIAoAAKkIACALAACqCAAgDAAAqwgAINUCAgAAAAHWAgEAAAAB3QJAAAAAAYoDQAAAAAHlAwEAAAAB7wMCAAAAAQIAAAAKACAsAACuCQAgBdUCAgAAAAHWAgEAAAAB3QJAAAAAAYoDQAAAAAHlAwEAAAABDdUCAgAAAAHdAkAAAAAB6wIBAAAAAYoDQAAAAAG8AwEAAAAByAMBAAAAAdoDAQAAAAHbAyAAAAAB4QNAAAAAAeUDAQAAAAHoAwIAAAAB7QMCAAAAAe4DAQAAAAEM1QICAAAAAd0CQAAAAAHrAgEAAAABigNAAAAAAdgDAQAAAAHaAwEAAAAB2wMgAAAAAeEDQAAAAAHlAwEAAAAB6AMCAAAAAeoDAQAAAAHrAwIAAAABCdUCAgAAAAHdAkAAAAAB6wIBAAAAAYoDQAAAAAG8AwEAAAAB2gMBAAAAAdsDIAAAAAHfAwIAAAAB4QNAAAAAAQMAAAAHACAsAACuCQAgLQAAtgkAIAwAAAAHACAEAADzBwAgCgAA9QcAIAsAAPYHACAMAAD3BwAgJwAAtgkAINUCAgDHBQAh1gIBAMMFACHdAkAAxgUAIYoDQADGBQAh5QMBAMMFACHvAwIA0AUAIQoEAADzBwAgCgAA9QcAIAsAAPYHACAMAAD3BwAg1QICAMcFACHWAgEAwwUAId0CQADGBQAhigNAAMYFACHlAwEAwwUAIe8DAgDQBQAhCgQAAKwIACAFAACoCAAgCwAAqggAIAwAAKsIACDVAgIAAAAB1gIBAAAAAd0CQAAAAAGKA0AAAAAB5QMBAAAAAe8DAgAAAAECAAAACgAgLAAAtwkAIAXVAgIAAAAB3QJAAAAAAYoDQAAAAAHjAwEAAAAB5AMBAAAAAQMAAAAHACAsAAC3CQAgLQAAvAkAIAwAAAAHACAEAADzBwAgBQAA9AcAIAsAAPYHACAMAAD3BwAgJwAAvAkAINUCAgDHBQAh1gIBAMMFACHdAkAAxgUAIYoDQADGBQAh5QMBAMMFACHvAwIA0AUAIQoEAADzBwAgBQAA9AcAIAsAAPYHACAMAAD3BwAg1QICAMcFACHWAgEAwwUAId0CQADGBQAhigNAAMYFACHlAwEAwwUAIe8DAgDQBQAhDwYAAOwHACDVAgIAAAAB3QJAAAAAAesCAQAAAAGKA0AAAAABugMCAAAAAbwDAQAAAAHIAwEAAAAB2gMBAAAAAdsDIAAAAAHhA0AAAAAB5QMBAAAAAegDAgAAAAHtAwIAAAAB7gMBAAAAAQIAAAAOACAsAAC9CQAgAwAAAAwAICwAAL0JACAtAADBCQAgEQAAAAwAIAYAAN4HACAnAADBCQAg1QICAMcFACHdAkAAxgUAIesCAQDDBQAhigNAAMYFACG6AwIAxwUAIbwDAQDDBQAhyAMBAMMFACHaAwEAxAUAIdsDIADFBQAh4QNAAMYFACHlAwEAwwUAIegDAgDHBQAh7QMCANAFACHuAwEAxAUAIQ8GAADeBwAg1QICAMcFACHdAkAAxgUAIesCAQDDBQAhigNAAMYFACG6AwIAxwUAIbwDAQDDBQAhyAMBAMMFACHaAwEAxAUAIdsDIADFBQAh4QNAAMYFACHlAwEAwwUAIegDAgDHBQAh7QMCANAFACHuAwEAxAUAIQoEAACsCAAgBQAAqAgAIAoAAKkIACAMAACrCAAg1QICAAAAAdYCAQAAAAHdAkAAAAABigNAAAAAAeUDAQAAAAHvAwIAAAABAgAAAAoAICwAAMIJACASEQAA_QgAIB0AAP4IACAeAAD_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_AwEAAAABwAMCAAAAAcEDAgAAAAHDAyAAAAABxAMBAAAAAcUDQAAAAAHGA0AAAAABxwNAAAAAAcgDAQAAAAHJAxAAAAABygMBAAAAAcsDEAAAAAHMAwEAAAABzQMBAAAAAc4DEAAAAAHPAxAAAAAB0AMBAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAQTVAgIAAAAB1gIBAAAAAd0CQAAAAAG8AwEAAAABAgAAAM8CACAsAADeCQAgH9UCAgAAAAHqAgIAAAABigNAAAAAAZ0DAAAAmgMCngMBAAAAAZ8DAQAAAAGgA0AAAAABoQMBAAAAAaMDAAAAowMDpAMBAAAAAaUDQAAAAAGmAwEAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAasDAQAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4AwEAAAABuQMBAAAAAQMAAAArACAsAADeCQAgLQAA4wkAIAYAAAArACAnAADjCQAg1QICAMcFACHWAgEAwwUAId0CQADGBQAhvAMBAMQFACEE1QICAMcFACHWAgEAwwUAId0CQADGBQAhvAMBAMQFACEfBgAA6wYAINUCAgAAAAHWAgEAAAAB3QJAAAAAAYMDAAAAwwMCigNAAAAAAboDAgAAAAG7AwEAAAABvAMBAAAAAb0DAQAAAAG-AwEAAAABvwMBAAAAAcADAgAAAAHBAwIAAAABwwMgAAAAAcQDAQAAAAHFA0AAAAABxgNAAAAAAccDQAAAAAHIAwEAAAAByQMQAAAAAcoDAQAAAAHLAxAAAAABzAMBAAAAAc0DAQAAAAHOAxAAAAABzwMQAAAAAdADAQAAAAHRAwEAAAAB0gMBAAAAAdMDAgAAAAECAAAALgAgLAAA5AkAIBILAAD8CAAgHQAA_ggAIB4AAP8IACAfAACACQAgIAAAgQkAICEAAIIJACDVAgIAAAAB1gIBAAAAAdcCAQAAAAHaAgEAAAAB3QJAAAAAAYoDQAAAAAGkAwEAAAABpQNAAAAAAfADAQAAAAHxAwEAAAAB8wMAAADzAwL0A0AAAAABAgAAAAEAICwAAOYJACAG1QICAAAAAfMCAAAAmgMD9AIAAACaAwP2AgEAAAAB9wICAAAAAfgCQAAAAAEH1QICAAAAAd0CQAAAAAH2AgEAAAABgwMAAACaAwKKA0AAAAABmgMCAAAAAZsDQAAAAAEH1QICAAAAAd0CQAAAAAH2AgEAAAABgwMAAACYAwKKA0AAAAABlgMBAAAAAZgDQAAAAAEW1QICAAAAAd0CQAAAAAH2AgEAAAAB_AIBAAAAAf0CEAAAAAH-AhAAAAABgAMAAACAAwKBAwEAAAABggMBAAAAAYMDAAAA8wIChANAAAAAAYUDAQAAAAGGA0AAAAABhwMCAAAAAYgDQAAAAAGJAwEAAAABigNAAAAAAYsDIAAAAAGMA4AAAAABjQMCAAAAAY4DQAAAAAGPA0AAAAABAwAAACkAICwAAOQJACAtAADuCQAgIQAAACkAIAYAAN0GACAnAADuCQAg1QICAMcFACHWAgEAwwUAId0CQADGBQAhgwMAANwGwwMiigNAAMYFACG6AwIA0AUAIbsDAQDEBQAhvAMBAMQFACG9AwEAxAUAIb4DAQDEBQAhvwMBAMQFACHAAwIA0AUAIcEDAgDHBQAhwwMgAMUFACHEAwEAxAUAIcUDQADmBQAhxgNAAOYFACHHA0AA5gUAIcgDAQDEBQAhyQMQAOMFACHKAwEAxAUAIcsDEADjBQAhzAMBAMQFACHNAwEAxAUAIc4DEADjBQAhzwMQAOMFACHQAwEAxAUAIdEDAQDEBQAh0gMBAMQFACHTAwIAxwUAIR8GAADdBgAg1QICAMcFACHWAgEAwwUAId0CQADGBQAhgwMAANwGwwMiigNAAMYFACG6AwIA0AUAIbsDAQDEBQAhvAMBAMQFACG9AwEAxAUAIb4DAQDEBQAhvwMBAMQFACHAAwIA0AUAIcEDAgDHBQAhwwMgAMUFACHEAwEAxAUAIcUDQADmBQAhxgNAAOYFACHHA0AA5gUAIcgDAQDEBQAhyQMQAOMFACHKAwEAxAUAIcsDEADjBQAhzAMBAMQFACHNAwEAxAUAIc4DEADjBQAhzwMQAOMFACHQAwEAxAUAIdEDAQDEBQAh0gMBAMQFACHTAwIAxwUAIQMAAAAnACAsAADmCQAgLQAA8QkAIBQAAAAnACALAACzCAAgHQAAtQgAIB4AALYIACAfAAC3CAAgIAAAuAgAICEAALkIACAnAADxCQAg1QICAMcFACHWAgEAwwUAIdcCAQDDBQAh2gIBAMQFACHdAkAAxgUAIYoDQADGBQAhpAMBAMQFACGlA0AA5gUAIfADAQDDBQAh8QMBAMQFACHzAwAAsgjzAyL0A0AA5gUAIRILAACzCAAgHQAAtQgAIB4AALYIACAfAAC3CAAgIAAAuAgAICEAALkIACDVAgIAxwUAIdYCAQDDBQAh1wIBAMMFACHaAgEAxAUAId0CQADGBQAhigNAAMYFACGkAwEAxAUAIaUDQADmBQAh8AMBAMMFACHxAwEAxAUAIfMDAACyCPMDIvQDQADmBQAhEgsAAPwIACARAAD9CAAgHgAA_wgAIB8AAIAJACAgAACBCQAgIQAAggkAINUCAgAAAAHWAgEAAAAB1wIBAAAAAdoCAQAAAAHdAkAAAAABigNAAAAAAaQDAQAAAAGlA0AAAAAB8AMBAAAAAfEDAQAAAAHzAwAAAPMDAvQDQAAAAAECAAAAAQAgLAAA8gkAICUPAADRBgAgEgAA0gYAIBcAANQGACAYAADVBgAgHAAA1gYAINUCAgAAAAHqAgIAAAABigNAAAAAAZwDAgAAAAGdAwAAAJoDAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDAQAAAAGjAwAAAKMDA6QDAQAAAAGlA0AAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrAwEAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAECAAAAJQAgLAAA9AkAIAMAAAAnACAsAADyCQAgLQAA-AkAIBQAAAAnACALAACzCAAgEQAAtAgAIB4AALYIACAfAAC3CAAgIAAAuAgAICEAALkIACAnAAD4CQAg1QICAMcFACHWAgEAwwUAIdcCAQDDBQAh2gIBAMQFACHdAkAAxgUAIYoDQADGBQAhpAMBAMQFACGlA0AA5gUAIfADAQDDBQAh8QMBAMQFACHzAwAAsgjzAyL0A0AA5gUAIRILAACzCAAgEQAAtAgAIB4AALYIACAfAAC3CAAgIAAAuAgAICEAALkIACDVAgIAxwUAIdYCAQDDBQAh1wIBAMMFACHaAgEAxAUAId0CQADGBQAhigNAAMYFACGkAwEAxAUAIaUDQADmBQAh8AMBAMMFACHxAwEAxAUAIfMDAACyCPMDIvQDQADmBQAhAwAAACMAICwAAPQJACAtAAD7CQAgJwAAACMAIA8AAJsGACASAACcBgAgFwAAngYAIBgAAJ8GACAcAACgBgAgJwAA-wkAINUCAgDHBQAh6gICANAFACGKA0AAxgUAIZwDAgDQBQAhnQMAAIYGmgMingMBAMMFACGfAwEAxAUAIaADQADGBQAhoQMBAMQFACGjAwAAmgajAyOkAwEAxAUAIaUDQADmBQAhpgMBAMQFACGnAwEAxAUAIagDAQDEBQAhqQMBAMQFACGqAwEAxAUAIasDAQDEBQAhrAMBAMQFACGtAwEAxAUAIa4DAQDEBQAhrwMBAMQFACGwAwEAxAUAIbEDAQDEBQAhsgMBAMQFACGzAwEAxAUAIbQDAQDEBQAhtQMBAMQFACG2AwEAxAUAIbcDAQDEBQAhuAMBAMQFACG5AwEAxAUAISUPAACbBgAgEgAAnAYAIBcAAJ4GACAYAACfBgAgHAAAoAYAINUCAgDHBQAh6gICANAFACGKA0AAxgUAIZwDAgDQBQAhnQMAAIYGmgMingMBAMMFACGfAwEAxAUAIaADQADGBQAhoQMBAMQFACGjAwAAmgajAyOkAwEAxAUAIaUDQADmBQAhpgMBAMQFACGnAwEAxAUAIagDAQDEBQAhqQMBAMQFACGqAwEAxAUAIasDAQDEBQAhrAMBAMQFACGtAwEAxAUAIa4DAQDEBQAhrwMBAMQFACGwAwEAxAUAIbEDAQDEBQAhsgMBAMQFACGzAwEAxAUAIbQDAQDEBQAhtQMBAMQFACG2AwEAxAUAIbcDAQDEBQAhuAMBAMQFACG5AwEAxAUAIRILAAD8CAAgEQAA_QgAIB0AAP4IACAfAACACQAgIAAAgQkAICEAAIIJACDVAgIAAAAB1gIBAAAAAdcCAQAAAAHaAgEAAAAB3QJAAAAAAYoDQAAAAAGkAwEAAAABpQNAAAAAAfADAQAAAAHxAwEAAAAB8wMAAADzAwL0A0AAAAABAgAAAAEAICwAAPwJACAlDwAA0QYAIBIAANIGACAVAADTBgAgGAAA1QYAIBwAANYGACDVAgIAAAAB6gICAAAAAYoDQAAAAAGcAwIAAAABnQMAAACaAwKeAwEAAAABnwMBAAAAAaADQAAAAAGhAwEAAAABowMAAACjAwOkAwEAAAABpQNAAAAAAaYDAQAAAAGnAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABqwMBAAAAAawDAQAAAAGtAwEAAAABrgMBAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAbIDAQAAAAGzAwEAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABtwMBAAAAAbgDAQAAAAG5AwEAAAABAgAAACUAICwAAP4JACADAAAAJwAgLAAA_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_ggAIB4AAP8IACAgAACBCQAgIQAAggkAINUCAgAAAAHWAgEAAAAB1wIBAAAAAdoCAQAAAAHdAkAAAAABigNAAAAAAaQDAQAAAAGlA0AAAAAB8AMBAAAAAfEDAQAAAAHzAwAAAPMDAvQDQAAAAAECAAAAAQAgLAAAiwoAICUPAADRBgAgEgAA0gYAIBUAANMGACAXAADUBgAgGAAA1QYAINUCAgAAAAHqAgIAAAABigNAAAAAAZwDAgAAAAGdAwAAAJoDAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDAQAAAAGjAwAAAKMDA6QDAQAAAAGlA0AAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrAwEAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAECAAAAJQAgLAAAjQoAIAnVAgIAAAAB8wIAAADzAgP0AgAAAPMCA_UCEAAAAAH2AgEAAAAB9wICAAAAAfgCQAAAAAH5AhAAAAAB-gIQAAAAAQMAAAAnACAsAACLCgAgLQAAkgoAIBQAAAAnACALAACzCAAgEQAAtAgAIB0AALUIACAeAAC2CAAgIAAAuAgAICEAALkIACAnAACSCgAg1QICAMcFACHWAgEAwwUAIdcCAQDDBQAh2gIBAMQFACHdAkAAxgUAIYoDQADGBQAhpAMBAMQFACGlA0AA5gUAIfADAQDDBQAh8QMBAMQFACHzAwAAsgjzAyL0A0AA5gUAIRILAACzCAAgEQAAtAgAIB0AALUIACAeAAC2CAAgIAAAuAgAICEAALkIACDVAgIAxwUAIdYCAQDDBQAh1wIBAMMFACHaAgEAxAUAId0CQADGBQAhigNAAMYFACGkAwEAxAUAIaUDQADmBQAh8AMBAMMFACHxAwEAxAUAIfMDAACyCPMDIvQDQADmBQAhAwAAACMAICwAAI0KACAtAACVCgAgJwAAACMAIA8AAJsGACASAACcBgAgFQAAnQYAIBcAAJ4GACAYAACfBgAgJwAAlQoAINUCAgDHBQAh6gICANAFACGKA0AAxgUAIZwDAgDQBQAhnQMAAIYGmgMingMBAMMFACGfAwEAxAUAIaADQADGBQAhoQMBAMQFACGjAwAAmgajAyOkAwEAxAUAIaUDQADmBQAhpgMBAMQFACGnAwEAxAUAIagDAQDEBQAhqQMBAMQFACGqAwEAxAUAIasDAQDEBQAhrAMBAMQFACGtAwEAxAUAIa4DAQDEBQAhrwMBAMQFACGwAwEAxAUAIbEDAQDEBQAhsgMBAMQFACGzAwEAxAUAIbQDAQDEBQAhtQMBAMQFACG2AwEAxAUAIbcDAQDEBQAhuAMBAMQFACG5AwEAxAUAISUPAACbBgAgEgAAnAYAIBUAAJ0GACAXAACeBgAgGAAAnwYAINUCAgDHBQAh6gICANAFACGKA0AAxgUAIZwDAgDQBQAhnQMAAIYGmgMingMBAMMFACGfAwEAxAUAIaADQADGBQAhoQMBAMQFACGjAwAAmgajAyOkAwEAxAUAIaUDQADmBQAhpgMBAMQFACGnAwEAxAUAIagDAQDEBQAhqQMBAMQFACGqAwEAxAUAIasDAQDEBQAhrAMBAMQFACGtAwEAxAUAIa4DAQDEBQAhrwMBAMQFACGwAwEAxAUAIbEDAQDEBQAhsgMBAMQFACGzAwEAxAUAIbQDAQDEBQAhtQMBAMQFACG2AwEAxAUAIbcDAQDEBQAhuAMBAMQFACG5AwEAxAUAIRILAAD8CAAgEQAA_QgAIB0AAP4IACAeAAD_CAAgHwAAgAkAICEAAIIJACDVAgIAAAAB1gIBAAAAAdcCAQAAAAHaAgEAAAAB3QJAAAAAAYoDQAAAAAGkAwEAAAABpQNAAAAAAfADAQAAAAHxAwEAAAAB8wMAAADzAwL0A0AAAAABAgAAAAEAICwAAJYKACAZEwAA9gUAIBkAAPcFACDVAgIAAAAB3QJAAAAAAfYCAQAAAAH7AgIAAAAB_AIBAAAAAf0CEAAAAAH-AhAAAAABgAMAAACAAwKBAwEAAAABggMBAAAAAYMDAAAA8wIChANAAAAAAYUDAQAAAAGGA0AAAAABhwMCAAAAAYgDQAAAAAGJAwEAAAABigNAAAAAAYsDIAAAAAGMA4AAAAABjQMCAAAAAY4DQAAAAAGPA0AAAAABAgAAAEYAICwAAJgKACADAAAAJwAgLAAAlgoAIC0AAJwKACAUAAAAJwAgCwAAswgAIBEAALQIACAdAAC1CAAgHgAAtggAIB8AALcIACAhAAC5CAAgJwAAnAoAINUCAgDHBQAh1gIBAMMFACHXAgEAwwUAIdoCAQDEBQAh3QJAAMYFACGKA0AAxgUAIaQDAQDEBQAhpQNAAOYFACHwAwEAwwUAIfEDAQDEBQAh8wMAALII8wMi9ANAAOYFACESCwAAswgAIBEAALQIACAdAAC1CAAgHgAAtggAIB8AALcIACAhAAC5CAAg1QICAMcFACHWAgEAwwUAIdcCAQDDBQAh2gIBAMQFACHdAkAAxgUAIYoDQADGBQAhpAMBAMQFACGlA0AA5gUAIfADAQDDBQAh8QMBAMQFACHzAwAAsgjzAyL0A0AA5gUAIQMAAABEACAsAACYCgAgLQAAnwoAIBsAAABEACATAADnBQAgGQAA6AUAICcAAJ8KACDVAgIAxwUAId0CQADGBQAh9gIBAMQFACH7AgIA0AUAIfwCAQDDBQAh_QIQAOMFACH-AhAA4wUAIYADAADkBYADIoEDAQDEBQAhggMBAMQFACGDAwAA5QXzAiKEA0AA5gUAIYUDAQDEBQAhhgNAAOYFACGHAwIA0AUAIYgDQADmBQAhiQMBAMQFACGKA0AAxgUAIYsDIADFBQAhjAOAAAAAAY0DAgDHBQAhjgNAAOYFACGPA0AA5gUAIRkTAADnBQAgGQAA6AUAINUCAgDHBQAh3QJAAMYFACH2AgEAxAUAIfsCAgDQBQAh_AIBAMMFACH9AhAA4wUAIf4CEADjBQAhgAMAAOQFgAMigQMBAMQFACGCAwEAxAUAIYMDAADlBfMCIoQDQADmBQAhhQMBAMQFACGGA0AA5gUAIYcDAgDQBQAhiANAAOYFACGJAwEAxAUAIYoDQADGBQAhiwMgAMUFACGMA4AAAAABjQMCAMcFACGOA0AA5gUAIY8DQADmBQAhEgsAAPwIACARAAD9CAAgHQAA_ggAIB4AAP8IACAfAACACQAgIAAAgQkAINUCAgAAAAHWAgEAAAAB1wIBAAAAAdoCAQAAAAHdAkAAAAABigNAAAAAAaQDAQAAAAGlA0AAAAAB8AMBAAAAAfEDAQAAAAHzAwAAAPMDAvQDQAAAAAECAAAAAQAgLAAAoAoAIAMAAAAnACAsAACgCgAgLQAApAoAIBQAAAAnACALAACzCAAgEQAAtAgAIB0AALUIACAeAAC2CAAgHwAAtwgAICAAALgIACAnAACkCgAg1QICAMcFACHWAgEAwwUAIdcCAQDDBQAh2gIBAMQFACHdAkAAxgUAIYoDQADGBQAhpAMBAMQFACGlA0AA5gUAIfADAQDDBQAh8QMBAMQFACHzAwAAsgjzAyL0A0AA5gUAIRILAACzCAAgEQAAtAgAIB0AALUIACAeAAC2CAAgHwAAtwgAICAAALgIACDVAgIAxwUAIdYCAQDDBQAh1wIBAMMFACHaAgEAxAUAId0CQADGBQAhigNAAMYFACGkAwEAxAUAIaUDQADmBQAh8AMBAMMFACHxAwEAxAUAIfMDAACyCPMDIvQDQADmBQAhCAkAGAsGAhEmCx1VEB5WER9XEyBYFCFcFwQDAAEGAAMJAAoOIQkGBAgDBQsDCQAICg8ECxUCDBkHAwYAAwgTBQkABgEHAAQBCBQAAQYAAwQFGgAKGwALHAAMHQABDQACAQ4iAAcJABYPKAESKgwVNhAXPBEYQhIcRxMDBiwNCQAPETELAgkADhAvDAEQMAABETIAAhM3CxQ4AQITPQsWPgEBE0MLBAkAFRNICxlJARtNFAIUTwEaThMBG1AABBVRABdSABhTABxUAAEPXQEHC14AEV8AHWAAHmEAH2IAIGMAIWQAAAUJABsyABwzAB00AB41AB8AAAAAAAUJABsyABwzAB00AB41AB8FCQAiMgAjMwAkNAAlNQAmAAAAAAAFCQAiMgAjMwAkNAAlNQAmBQkAKTIAKjMAKzQALDUALQAAAAAABQkAKTIAKjMAKzQALDUALQUJADAyADEzADI0ADM1ADQAAAAAAAUJADAyADEzADI0ADM1ADQFCQA3MgA4MwA5NAA6NQA7AAAAAAAFCQA3MgA4MwA5NAA6NQA7BQkAPjIAPzMAQDQAQTUAQgAAAAAABQkAPjIAPzMAQDQAQTUAQgIJAEZ_4gFFAX4ARAF_4wEABQkASDIASTMASjQASzUATAAAAAAABQkASDIASTMASjQASzUATAUJAE8yAFAzAFE0AFI1AFMAAAAAAAUJAE8yAFAzAFE0AFI1AFMFCQBWMgBXMwBYNABZNQBaAAAAAAAFCQBWMgBXMwBYNABZNQBaAAUJAF4yAF8zAGA0AGE1AGIAAAAAAAUJAF4yAF8zAGA0AGE1AGIABQkAZjIAZzMAaDQAaTUAagAAAAAABQkAZjIAZzMAaDQAaTUAagUJAG0yAG4zAG80AHA1AHEAAAAAAAUJAG0yAG4zAG80AHA1AHEFCQB0MgB1MwB2NAB3NQB4AAAAAAAFCQB0MgB1MwB2NAB3NQB4BQkAezIAfDMAfTQAfjUAfwAAAAAABQkAezIAfDMAfTQAfjUAfwUJAIIBMgCDATMAhAE0AIUBNQCGAQAAAAAABQkAggEyAIMBMwCEATQAhQE1AIYBBQkAiQEyAIoBMwCLATQAjAE1AI0BAAAAAAAFCQCJATIAigEzAIsBNACMATUAjQEFCQCQATIAkQEzAJIBNACTATUAlAEAAAAAAAUJAJABMgCRATMAkgE0AJMBNQCUAQUJAJcBMgCYATMAmQE0AJoBNQCbAQAAAAAABQkAlwEyAJgBMwCZATQAmgE1AJsBBQkAngEyAJ8BMwCgATQAoQE1AKIBAAAAAAAFCQCeATIAnwEzAKABNAChATUAogEFCQClATIApgEzAKcBNACoATUAqQEAAAAAAAUJAKUBMgCmATMApwE0AKgBNQCpAQAFCQCtATIArgEzAK8BNACwATUAsQEAAAAAAAUJAK0BMgCuATMArwE0ALABNQCxASICASNlASRnASVoASZpAShrASltGSpvAStxGS5yAS9zATB0GTZ3Gjd4IDh5Azl6Azp7Azt8Azx9Az1_Az6BARk_gwEDQIUBGUGGAQNChwEDQ4gBGUSLASFFjAEnRo0BBEeOAQRIjwEESZABBEqRAQRLkwEETJUBGU2XAQROmQEZT5oBBFCbAQRRnAEZUp8BKFOgAS5UoQEFVaIBBVajAQVXpAEFWKUBBVmnAQVaqQEZW6sBBVytARldrgEFXq8BBV-wARlgswEvYbQBNWK1AQJjtgECZLcBAmW4AQJmuQECZ7sBAmi9ARlpvwECasEBGWvCAQJswwECbcQBGW7HATZvyAE8cMkBCXHKAQlyywEJc8wBCXTNAQl1zwEJdtEBGXfTAQl41QEZedYBCXrXAQl72AEZfNsBPX3cAUOAAd4BRIEB5AFEggHnAUSDAegBRIQB6QFEhQHrAUSGAe0BGYcB7wFEiAHxARmJAfIBRIoB8wFEiwH0ARmMAfcBR40B-AFNjgH5AUWPAfoBRZAB-wFFkQH8AUWSAf0BRZMB_wFFlAGBAhmVAYMCRZYBhQIZlwGGAkWYAYcCRZkBiAIZmgGLAk6bAYwCVJwBjQIHnQGOAgeeAY8CB58BkAIHoAGRAgehAZMCB6IBlQIZowGXAgekAZkCGaUBmgIHpgGbAgenAZwCGagBnwJVqQGgAluqAaICXKsBowJcrAGmAlytAacCXK4BqAJcrwGqAlywAawCGbEBrgJcsgGwAhmzAbECXLQBsgJctQGzAhm2AbYCXbcBtwJjuAG5AmS5AboCZLoBvQJkuwG-AmS8Ab8CZL0BwQJkvgHDAhm_AcUCZMABxwIZwQHIAmTCAckCZMMBygIZxAHNAmXFAc4Ca8YB0AINxwHRAg3IAdMCDckB1AINygHVAg3LAdcCDcwB2QIZzQHbAg3OAd0CGc8B3gIN0AHfAg3RAeACGdIB4wJs0wHkAnLUAeUCDNUB5gIM1gHnAgzXAegCDNgB6QIM2QHrAgzaAe0CGdsB7wIM3AHxAhndAfICDN4B8wIM3wH0AhngAfcCc-EB-AJ54gH5AgvjAfoCC-QB-wIL5QH8AgvmAf0CC-cB_wIL6AGBAxnpAYMDC-oBhQMZ6wGGAwvsAYcDC-0BiAMZ7gGLA3rvAYwDgAHwAY0DEPEBjgMQ8gGPAxDzAZADEPQBkQMQ9QGTAxD2AZUDGfcBlwMQ-AGZAxn5AZoDEPoBmwMQ-wGcAxn8AZ8DgQH9AaADhwH-AaEDEf8BogMRgAKjAxGBAqQDEYICpQMRgwKnAxGEAqkDGYUCqwMRhgKtAxmHAq4DEYgCrwMRiQKwAxmKArMDiAGLArQDjgGMArUDEo0CtgMSjgK3AxKPArgDEpACuQMSkQK7AxKSAr0DGZMCvwMSlALBAxmVAsIDEpYCwwMSlwLEAxmYAscDjwGZAsgDlQGaAskDE5sCygMTnALLAxOdAswDE54CzQMTnwLPAxOgAtEDGaEC0wMTogLVAxmjAtYDE6QC1wMTpQLYAxmmAtsDlgGnAtwDnAGoAt0DFKkC3gMUqgLfAxSrAuADFKwC4QMUrQLjAxSuAuUDGa8C5wMUsALpAxmxAuoDFLIC6wMUswLsAxm0Au8DnQG1AvADowG2AvEDF7cC8gMXuALzAxe5AvQDF7oC9QMXuwL3Axe8AvkDGb0C-wMXvgL9Axm_Av4DF8AC_wMXwQKABBnCAoMEpAHDAoQEqgHEAoYEqwHFAocEqwHGAooEqwHHAosEqwHIAowEqwHJAo4EqwHKApAEGcsCkgSrAcwClAQZzQKVBKsBzgKWBKsBzwKXBBnQApoErAHRApsEsgE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.mysql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.mysql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  ArticleOrderByRelevanceFieldEnum: () => ArticleOrderByRelevanceFieldEnum,
  ArticleScalarFieldEnum: () => ArticleScalarFieldEnum,
  ArticleViewOrderByRelevanceFieldEnum: () => ArticleViewOrderByRelevanceFieldEnum,
  ArticleViewScalarFieldEnum: () => ArticleViewScalarFieldEnum,
  CategoryOrderByRelevanceFieldEnum: () => CategoryOrderByRelevanceFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  ContactMessageOrderByRelevanceFieldEnum: () => ContactMessageOrderByRelevanceFieldEnum,
  ContactMessageScalarFieldEnum: () => ContactMessageScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EventOrderByRelevanceFieldEnum: () => EventOrderByRelevanceFieldEnum,
  EventScalarFieldEnum: () => EventScalarFieldEnum,
  EventViewOrderByRelevanceFieldEnum: () => EventViewOrderByRelevanceFieldEnum,
  EventViewScalarFieldEnum: () => EventViewScalarFieldEnum,
  GalleryOrderByRelevanceFieldEnum: () => GalleryOrderByRelevanceFieldEnum,
  GalleryScalarFieldEnum: () => GalleryScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  ModelName: () => ModelName,
  NotificationOrderByRelevanceFieldEnum: () => NotificationOrderByRelevanceFieldEnum,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentHistoryOrderByRelevanceFieldEnum: () => PaymentHistoryOrderByRelevanceFieldEnum,
  PaymentHistoryScalarFieldEnum: () => PaymentHistoryScalarFieldEnum,
  PaymentOrderByRelevanceFieldEnum: () => PaymentOrderByRelevanceFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PlacementStatusOrderByRelevanceFieldEnum: () => PlacementStatusOrderByRelevanceFieldEnum,
  PlacementStatusScalarFieldEnum: () => PlacementStatusScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProgramCategoryOrderByRelevanceFieldEnum: () => ProgramCategoryOrderByRelevanceFieldEnum,
  ProgramCategoryScalarFieldEnum: () => ProgramCategoryScalarFieldEnum,
  ProgramOrderByRelevanceFieldEnum: () => ProgramOrderByRelevanceFieldEnum,
  ProgramScalarFieldEnum: () => ProgramScalarFieldEnum,
  QueryMode: () => QueryMode,
  RegistrationOrderByRelevanceFieldEnum: () => RegistrationOrderByRelevanceFieldEnum,
  RegistrationScalarFieldEnum: () => RegistrationScalarFieldEnum,
  RegistrationStatusHistoryOrderByRelevanceFieldEnum: () => RegistrationStatusHistoryOrderByRelevanceFieldEnum,
  RegistrationStatusHistoryScalarFieldEnum: () => RegistrationStatusHistoryScalarFieldEnum,
  SelectionStatusOrderByRelevanceFieldEnum: () => SelectionStatusOrderByRelevanceFieldEnum,
  SelectionStatusScalarFieldEnum: () => SelectionStatusScalarFieldEnum,
  ServiceOrderByRelevanceFieldEnum: () => ServiceOrderByRelevanceFieldEnum,
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  ServiceViewOrderByRelevanceFieldEnum: () => ServiceViewOrderByRelevanceFieldEnum,
  ServiceViewScalarFieldEnum: () => ServiceViewScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TeamMemberOrderByRelevanceFieldEnum: () => TeamMemberOrderByRelevanceFieldEnum,
  TeamMemberScalarFieldEnum: () => TeamMemberScalarFieldEnum,
  TestimonialOrderByRelevanceFieldEnum: () => TestimonialOrderByRelevanceFieldEnum,
  TestimonialScalarFieldEnum: () => TestimonialScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserOrderByRelevanceFieldEnum: () => UserOrderByRelevanceFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Category: "Category",
  Event: "Event",
  EventView: "EventView",
  Article: "Article",
  ArticleView: "ArticleView",
  Service: "Service",
  ServiceView: "ServiceView",
  Gallery: "Gallery",
  TeamMember: "TeamMember",
  Testimonial: "Testimonial",
  ProgramCategory: "ProgramCategory",
  Program: "Program",
  Registration: "Registration",
  RegistrationStatusHistory: "RegistrationStatusHistory",
  SelectionStatus: "SelectionStatus",
  PlacementStatus: "PlacementStatus",
  Payment: "Payment",
  PaymentHistory: "PaymentHistory",
  Notification: "Notification",
  ContactMessage: "ContactMessage"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  password: "password",
  name: "name",
  phone: "phone",
  address: "address",
  birthPlace: "birthPlace",
  birthDate: "birthDate",
  role: "role",
  emailVerifiedAt: "emailVerifiedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  parentId: "parentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EventScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  description: "description",
  eventDate: "eventDate",
  location: "location",
  isFeatured: "isFeatured",
  maxParticipants: "maxParticipants",
  link: "link",
  image: "image",
  categoryId: "categoryId",
  views: "views",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EventViewScalarFieldEnum = {
  id: "id",
  eventId: "eventId",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ArticleScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  content: "content",
  excerpt: "excerpt",
  authorId: "authorId",
  eventDate: "eventDate",
  isFeatured: "isFeatured",
  image: "image",
  categoryId: "categoryId",
  views: "views",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ArticleViewScalarFieldEnum = {
  id: "id",
  articleId: "articleId",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServiceScalarFieldEnum = {
  id: "id",
  slug: "slug",
  title: "title",
  icon: "icon",
  summary: "summary",
  content: "content",
  views: "views",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServiceViewScalarFieldEnum = {
  id: "id",
  serviceId: "serviceId",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var GalleryScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  image: "image",
  categoryId: "categoryId",
  isFeatured: "isFeatured",
  eventDate: "eventDate",
  order: "order",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeamMemberScalarFieldEnum = {
  id: "id",
  type: "type",
  name: "name",
  position: "position",
  bio: "bio",
  image: "image",
  order: "order",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TestimonialScalarFieldEnum = {
  id: "id",
  clientName: "clientName",
  company: "company",
  content: "content",
  rating: "rating",
  image: "image",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProgramCategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt"
};
var ProgramScalarFieldEnum = {
  id: "id",
  categoryId: "categoryId",
  name: "name",
  programFormat: "programFormat",
  description: "description",
  requirements: "requirements",
  schedule: "schedule",
  duration: "duration",
  capacity: "capacity",
  currentParticipants: "currentParticipants",
  status: "status",
  isRunning: "isRunning",
  contactInfo: "contactInfo",
  registrationDeadline: "registrationDeadline",
  startDate: "startDate",
  endDate: "endDate",
  location: "location",
  trainingCost: "trainingCost",
  trainingFeeDetails: "trainingFeeDetails",
  departureCost: "departureCost",
  departureFeeDetails: "departureFeeDetails",
  installmentPlan: "installmentPlan",
  downPayment: "downPayment",
  jobMatchingCost: "jobMatchingCost",
  bridgeFund: "bridgeFund",
  timelineText: "timelineText",
  requirementsText: "requirementsText",
  sortOrder: "sortOrder",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RegistrationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  programId: "programId",
  registrationStatus: "registrationStatus",
  registrationCode: "registrationCode",
  selectionNotes: "selectionNotes",
  registrationDate: "registrationDate",
  updatedAt: "updatedAt",
  nik: "nik",
  gender: "gender",
  birthPlace: "birthPlace",
  birthDate: "birthDate",
  lastEducation: "lastEducation",
  major: "major",
  educationInstitution: "educationInstitution",
  currentActivity: "currentActivity",
  maritalStatus: "maritalStatus",
  parentPhone: "parentPhone",
  parentRelationship: "parentRelationship",
  ktpProvinceCode: "ktpProvinceCode",
  ktpProvinceName: "ktpProvinceName",
  ktpCityCode: "ktpCityCode",
  ktpCityName: "ktpCityName",
  ktpAddress: "ktpAddress",
  domicileProvinceCode: "domicileProvinceCode",
  domicileProvinceName: "domicileProvinceName",
  domicileCityCode: "domicileCityCode",
  domicileCityName: "domicileCityName",
  domicileAddress: "domicileAddress",
  photoPath: "photoPath",
  n4CertificatePath: "n4CertificatePath",
  sswCertificatePath: "sswCertificatePath"
};
var RegistrationStatusHistoryScalarFieldEnum = {
  id: "id",
  registrationId: "registrationId",
  oldStatus: "oldStatus",
  newStatus: "newStatus",
  notes: "notes",
  changedBy: "changedBy",
  changedAt: "changedAt"
};
var SelectionStatusScalarFieldEnum = {
  id: "id",
  registrationId: "registrationId",
  status: "status",
  notes: "notes",
  evaluatedBy: "evaluatedBy",
  evaluatedAt: "evaluatedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PlacementStatusScalarFieldEnum = {
  id: "id",
  registrationId: "registrationId",
  companyName: "companyName",
  status: "status",
  placementDate: "placementDate",
  notes: "notes",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  registrationId: "registrationId",
  invoiceNumber: "invoiceNumber",
  amount: "amount",
  amountPaid: "amountPaid",
  paymentMethod: "paymentMethod",
  bankName: "bankName",
  accountNumber: "accountNumber",
  status: "status",
  dueDate: "dueDate",
  proofImage: "proofImage",
  paymentDate: "paymentDate",
  verifiedBy: "verifiedBy",
  verifiedAt: "verifiedAt",
  receiptNumber: "receiptNumber",
  notes: "notes",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isManualInvoice: "isManualInvoice",
  installmentAmounts: "installmentAmounts",
  currentInstallmentNumber: "currentInstallmentNumber",
  nextDueDate: "nextDueDate",
  issuedAt: "issuedAt"
};
var PaymentHistoryScalarFieldEnum = {
  id: "id",
  paymentId: "paymentId",
  oldStatus: "oldStatus",
  newStatus: "newStatus",
  amountChanged: "amountChanged",
  notes: "notes",
  changedBy: "changedBy",
  changedAt: "changedAt",
  oldAmountPaid: "oldAmountPaid",
  newAmountPaid: "newAmountPaid"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  message: "message",
  type: "type",
  isRead: "isRead",
  relatedEntity: "relatedEntity",
  relatedEntityId: "relatedEntityId",
  createdAt: "createdAt"
};
var ContactMessageScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  subject: "subject",
  message: "message",
  phone: "phone",
  company: "company",
  isRead: "isRead",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var UserOrderByRelevanceFieldEnum = {
  email: "email",
  password: "password",
  name: "name",
  phone: "phone",
  address: "address",
  birthPlace: "birthPlace"
};
var CategoryOrderByRelevanceFieldEnum = {
  name: "name",
  slug: "slug"
};
var EventOrderByRelevanceFieldEnum = {
  title: "title",
  slug: "slug",
  description: "description",
  location: "location",
  link: "link",
  image: "image"
};
var EventViewOrderByRelevanceFieldEnum = {
  ipAddress: "ipAddress",
  userAgent: "userAgent"
};
var ArticleOrderByRelevanceFieldEnum = {
  title: "title",
  slug: "slug",
  content: "content",
  excerpt: "excerpt",
  image: "image"
};
var ArticleViewOrderByRelevanceFieldEnum = {
  ipAddress: "ipAddress",
  userAgent: "userAgent"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var ServiceOrderByRelevanceFieldEnum = {
  slug: "slug",
  title: "title",
  icon: "icon",
  summary: "summary"
};
var ServiceViewOrderByRelevanceFieldEnum = {
  ipAddress: "ipAddress",
  userAgent: "userAgent"
};
var GalleryOrderByRelevanceFieldEnum = {
  title: "title",
  description: "description",
  image: "image"
};
var TeamMemberOrderByRelevanceFieldEnum = {
  name: "name",
  position: "position",
  bio: "bio",
  image: "image"
};
var TestimonialOrderByRelevanceFieldEnum = {
  clientName: "clientName",
  company: "company",
  content: "content",
  image: "image"
};
var ProgramCategoryOrderByRelevanceFieldEnum = {
  name: "name",
  description: "description"
};
var ProgramOrderByRelevanceFieldEnum = {
  name: "name",
  programFormat: "programFormat",
  description: "description",
  requirements: "requirements",
  schedule: "schedule",
  duration: "duration",
  contactInfo: "contactInfo",
  location: "location",
  trainingFeeDetails: "trainingFeeDetails",
  departureFeeDetails: "departureFeeDetails",
  installmentPlan: "installmentPlan",
  bridgeFund: "bridgeFund",
  timelineText: "timelineText",
  requirementsText: "requirementsText"
};
var RegistrationOrderByRelevanceFieldEnum = {
  registrationCode: "registrationCode",
  selectionNotes: "selectionNotes",
  nik: "nik",
  birthPlace: "birthPlace",
  lastEducation: "lastEducation",
  major: "major",
  educationInstitution: "educationInstitution",
  currentActivity: "currentActivity",
  maritalStatus: "maritalStatus",
  parentPhone: "parentPhone",
  parentRelationship: "parentRelationship",
  ktpProvinceCode: "ktpProvinceCode",
  ktpProvinceName: "ktpProvinceName",
  ktpCityCode: "ktpCityCode",
  ktpCityName: "ktpCityName",
  ktpAddress: "ktpAddress",
  domicileProvinceCode: "domicileProvinceCode",
  domicileProvinceName: "domicileProvinceName",
  domicileCityCode: "domicileCityCode",
  domicileCityName: "domicileCityName",
  domicileAddress: "domicileAddress",
  photoPath: "photoPath",
  n4CertificatePath: "n4CertificatePath",
  sswCertificatePath: "sswCertificatePath"
};
var RegistrationStatusHistoryOrderByRelevanceFieldEnum = {
  notes: "notes"
};
var SelectionStatusOrderByRelevanceFieldEnum = {
  notes: "notes"
};
var PlacementStatusOrderByRelevanceFieldEnum = {
  companyName: "companyName",
  notes: "notes"
};
var PaymentOrderByRelevanceFieldEnum = {
  invoiceNumber: "invoiceNumber",
  bankName: "bankName",
  accountNumber: "accountNumber",
  proofImage: "proofImage",
  receiptNumber: "receiptNumber",
  notes: "notes"
};
var PaymentHistoryOrderByRelevanceFieldEnum = {
  notes: "notes"
};
var NotificationOrderByRelevanceFieldEnum = {
  title: "title",
  message: "message"
};
var ContactMessageOrderByRelevanceFieldEnum = {
  name: "name",
  email: "email",
  subject: "subject",
  message: "message",
  phone: "phone",
  company: "company"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  superadmin: "superadmin",
  admin: "admin",
  editor: "editor",
  user: "user"
};
var ProgramStatus = {
  active: "active",
  inactive: "inactive",
  full: "full"
};
var Gender = {
  L: "L",
  P: "P"
};
var RegistrationStatus = {
  menunggu: "menunggu",
  lolos: "lolos",
  tidak_lolos: "tidak_lolos"
};
var PlacementStage = {
  proses: "proses",
  lolos: "lolos",
  ditempatkan: "ditempatkan"
};
var PaymentMethod = {
  transfer: "transfer",
  cash: "cash",
  credit_card: "credit_card"
};
var PaymentStatus = {
  pending: "pending",
  installment_1: "installment_1",
  installment_2: "installment_2",
  installment_3: "installment_3",
  installment_4: "installment_4",
  installment_5: "installment_5",
  installment_6: "installment_6",
  paid: "paid",
  overdue: "overdue",
  cancelled: "cancelled"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/prisma.ts
var adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});
var prisma = new PrismaClient({ adapter });
var prisma_default = prisma;

// src/utils/password.ts
import bcrypt from "bcryptjs";

// src/config/admin.config.ts
var NEW_REGISTRANT_WINDOW_DAYS = 7;
var REVENUE_PAYMENT_STATUSES = ["paid"];
var PENDING_ACTION_PAYMENT_STATUSES = ["pending"];
var DEFAULT_PAGE_SIZE = 50;
var MAX_PAGE_SIZE = 100;
var SEARCH_MAX_LENGTH = 100;
var PASSWORD_MIN_LENGTH = 6;
var PASSWORD_MAX_LENGTH = 72;
var BCRYPT_ROUNDS = 12;

// src/utils/password.ts
function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET;
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// src/utils/emailVerification.ts
import crypto from "crypto";
import jwt2 from "jsonwebtoken";
var PURPOSE = "email_verify";
function secret() {
  return crypto.createHmac("sha256", process.env.JWT_SECRET).update("email-verification-v1").digest("hex");
}
function signEmailVerificationToken(userId, email) {
  return jwt2.sign({ purpose: PURPOSE, userId, email }, secret(), {
    expiresIn: "24h",
    algorithm: "HS256"
  });
}
function verifyEmailVerificationToken(token) {
  const payload = jwt2.verify(token, secret(), { algorithms: ["HS256"] });
  if (payload.purpose !== PURPOSE || typeof payload.userId !== "number" || !payload.email) {
    throw new Error("INVALID_TOKEN");
  }
  return { userId: payload.userId, email: payload.email };
}

// src/config/email.config.ts
var DEFAULT_CLIENT_URL = "http://localhost:3000";
var EMAIL_BRAND = {
  name: "FITALENTA",
  company: "PT FAST Indo Talenta",
  website: "fitalenta.co.id",
  websiteUrl: "https://fitalenta.co.id",
  supportEmail: "info@fitalenta.co.id",
  phone: "0811 1011 9273",
  addressLines: ["Gedung Science and Techno Park ITB", "Jl. Ganesa No.15E, Lb. Siliwangi, Kec. Coblong, Bandung 40132"],
  logoPath: "/fitalenta.png",
  colors: {
    header: "#071d40",
    primary: "#0e4a8f",
    accent: "#e84c23",
    heading: "#0b1f3a",
    text: "#334155",
    muted: "#64748b",
    border: "#e2e8f0",
    page: "#f1f5f9",
    surface: "#ffffff",
    soft: "#f8fafc"
  },
  fontStack: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
};
function getClientBaseUrl() {
  return (process.env.CLIENT_URL || process.env.CORS_ORIGIN || DEFAULT_CLIENT_URL).replace(/\/$/, "");
}
function getEmailLogoUrl() {
  return process.env.EMAIL_LOGO_URL || `${getClientBaseUrl()}${EMAIL_BRAND.logoPath}`;
}

// src/config/password.config.ts
var PASSWORD_RESET_TTL_MINUTES = 30;

// src/utils/passwordResetToken.ts
import crypto2 from "crypto";
import jwt3 from "jsonwebtoken";
var TOKEN_PURPOSE = "password_reset";
function deriveSecret(passwordHash) {
  return crypto2.createHmac("sha256", process.env.JWT_SECRET).update(`password-reset-v1:${passwordHash}`).digest("hex");
}
function signPasswordResetToken(user) {
  return jwt3.sign({ purpose: TOKEN_PURPOSE, userId: user.id }, deriveSecret(user.password), {
    algorithm: "HS256",
    expiresIn: PASSWORD_RESET_TTL_MINUTES * 60
  });
}
function readPasswordResetUserId(token) {
  const payload = jwt3.decode(token);
  if (!payload || typeof payload === "string" || typeof payload.userId !== "number") return null;
  return payload.userId;
}
function isPasswordResetTokenValid(token, user) {
  try {
    const payload = jwt3.verify(token, deriveSecret(user.password), { algorithms: ["HS256"] });
    return typeof payload !== "string" && payload.purpose === TOKEN_PURPOSE && payload.userId === user.id;
  } catch {
    return false;
  }
}

// src/utils/html.ts
var HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => HTML_ESCAPES[char]);
}

// src/utils/templates/email/layout.ts
var { colors, fontStack } = EMAIL_BRAND;
function renderPreheader(text) {
  const filler = "&nbsp;&zwnj;".repeat(40);
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(text)}${filler}</div>`;
}
var emailParts = {
  heading(text) {
    return `<h1 style="margin:0 0 20px;font-family:${fontStack};font-size:24px;line-height:1.3;font-weight:700;color:${colors.heading};">${escapeHtml(text)}</h1>`;
  },
  paragraph(text) {
    return `<p style="margin:0 0 16px;font-family:${fontStack};font-size:15px;line-height:1.7;color:${colors.text};">${escapeHtml(text)}</p>`;
  },
  button(label, href) {
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
        <tr>
          <td align="center" bgcolor="${colors.primary}" style="border-radius:8px;">
            <a href="${escapeHtml(href)}" target="_blank" class="btn" style="display:inline-block;padding:14px 32px;font-family:${fontStack};font-size:15px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a>
          </td>
        </tr>
      </table>`;
  },
  note(text) {
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
        <tr>
          <td style="padding:14px 16px;background:${colors.soft};border-left:4px solid ${colors.accent};border-radius:0 8px 8px 0;font-family:${fontStack};font-size:13px;line-height:1.6;color:${colors.text};">${escapeHtml(text)}</td>
        </tr>
      </table>`;
  },
  linkFallback(href) {
    return `
      <p style="margin:24px 0 6px;font-family:${fontStack};font-size:12px;line-height:1.6;color:${colors.muted};">Tombol tidak berfungsi? Salin dan tempel tautan berikut ke browser Anda:</p>
      <p style="margin:0;font-family:${fontStack};font-size:12px;line-height:1.6;word-break:break-all;"><a href="${escapeHtml(href)}" target="_blank" style="color:${colors.primary};text-decoration:underline;">${escapeHtml(href)}</a></p>`;
  },
  divider() {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 20px;"><tr><td style="border-top:1px solid ${colors.border};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
  },
  smallText(text) {
    return `<p style="margin:0 0 8px;font-family:${fontStack};font-size:13px;line-height:1.6;color:${colors.muted};">${escapeHtml(text)}</p>`;
  }
};
function renderEmailLayout({ title, preheader, bodyHtml, footerNote }) {
  const { name, company, website, websiteUrl, supportEmail, phone, addressLines } = EMAIL_BRAND;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return `<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .btn { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${colors.page};-webkit-text-size-adjust:100%;">
  ${renderPreheader(preheader)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.page}" style="background:${colors.page};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="background:${colors.surface};border:1px solid ${colors.border};border-radius:14px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="px" bgcolor="${colors.header}" style="padding:26px 40px;background:${colors.header};">
                    <a href="${escapeHtml(websiteUrl)}" target="_blank" style="text-decoration:none;">
                      <img src="${escapeHtml(getEmailLogoUrl())}" alt="${escapeHtml(name)}" height="38" style="display:block;border:0;outline:none;height:38px;width:auto;font-family:${fontStack};font-size:22px;font-weight:700;color:#ffffff;">
                    </a>
                  </td>
                </tr>
                <tr><td bgcolor="${colors.accent}" style="height:4px;font-size:0;line-height:0;background:${colors.accent};">&nbsp;</td></tr>
                <tr>
                  <td class="px" style="padding:36px 40px 32px;">
                    ${bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td class="px" bgcolor="${colors.soft}" style="padding:24px 40px;background:${colors.soft};border-top:1px solid ${colors.border};">
                    ${footerNote ? `<p style="margin:0 0 12px;font-family:${fontStack};font-size:12px;line-height:1.6;color:${colors.muted};">${escapeHtml(footerNote)}</p>` : ""}
                    <p style="margin:0 0 4px;font-family:${fontStack};font-size:13px;line-height:1.6;font-weight:700;color:${colors.heading};">${escapeHtml(company)}</p>
                    <p style="margin:0;font-family:${fontStack};font-size:12px;line-height:1.7;color:${colors.muted};">
                      ${addressLines.map(escapeHtml).join("<br>")}<br>
                      Telp. ${escapeHtml(phone)} &middot; <a href="mailto:${escapeHtml(supportEmail)}" style="color:${colors.primary};text-decoration:none;">${escapeHtml(supportEmail)}</a><br>
                      <a href="${escapeHtml(websiteUrl)}" target="_blank" style="color:${colors.primary};text-decoration:none;">${escapeHtml(website)}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 12px 0;font-family:${fontStack};font-size:11px;line-height:1.6;color:${colors.muted};">
              &copy; ${year} ${escapeHtml(company)}. Seluruh hak dilindungi.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function renderTextFooter() {
  const { company, addressLines, phone, supportEmail, website } = EMAIL_BRAND;
  return ["--", company, ...addressLines, `Telp. ${phone} | ${supportEmail}`, website].join("\n");
}

// src/utils/templates/email/actionEmail.ts
function renderActionEmail(content) {
  const { preheader, title, name, paragraphs, buttonLabel, link, expiryNote, outro } = content;
  const bodyHtml = [
    emailParts.heading(title),
    emailParts.paragraph(`Halo ${name},`),
    ...paragraphs.map(emailParts.paragraph),
    emailParts.button(buttonLabel, link),
    emailParts.note(expiryNote),
    emailParts.linkFallback(link),
    emailParts.divider(),
    emailParts.smallText(outro)
  ].join("\n");
  const html = renderEmailLayout({
    title,
    preheader,
    bodyHtml,
    footerNote: "Email ini dikirim otomatis. Mohon tidak membalas email ini."
  });
  const text = [
    title,
    "",
    `Halo ${name},`,
    "",
    ...paragraphs.flatMap((paragraph) => [paragraph, ""]),
    `${buttonLabel}:`,
    link,
    "",
    expiryNote,
    "",
    outro,
    "",
    renderTextFooter()
  ].join("\n");
  return { html, text };
}

// src/services/mailer.service.ts
import nodemailer from "nodemailer";

// src/config/resend.ts
import { Resend } from "resend";
var instance = null;
function getResendClient() {
  if (instance) return instance;
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_dummy_key_for_dev") {
    return null;
  }
  instance = new Resend(key);
  return instance;
}

// src/services/mailer.service.ts
var transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT) || 465;
  const isSecure = process.env.SMTP_SECURE !== void 0 ? process.env.SMTP_SECURE === "true" : port === 465;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || ""
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "true"
    }
  });
  return transporter;
}
function getDefaultSender() {
  return process.env.MAIL_FROM || process.env.AUTH_EMAIL_FROM || process.env.CONTACT_EMAIL_FROM || (process.env.SMTP_USER ? `Fitalenta <${process.env.SMTP_USER}>` : "Fitalenta <noreply@fitalenta.co.id>");
}
async function sendMail(options4) {
  const from = options4.from || getDefaultSender();
  const smtp = getTransporter();
  if (smtp) {
    await smtp.sendMail({
      from,
      to: options4.to,
      subject: options4.subject,
      html: options4.html,
      text: options4.text,
      replyTo: options4.replyTo
    });
    return;
  }
  const resend = getResendClient();
  if (resend) {
    const { error } = await resend.emails.send({
      from,
      to: options4.to,
      subject: options4.subject,
      html: options4.html,
      text: options4.text || "",
      replyTo: options4.replyTo
    });
    if (error) throw new Error(error.message);
    return;
  }
  throw new Error("Layanan email belum dikonfigurasi. Pastikan SMTP_HOST (cPanel/Gmail) atau RESEND_API_KEY telah diatur di server/.env");
}

// src/services/authMail.service.ts
function buildClientLink(path10, token) {
  return `${getClientBaseUrl()}${path10}?token=${encodeURIComponent(token)}`;
}
async function deliver(to, subject, { html, text }) {
  await sendMail({ to, subject, html, text });
}
function dispatch(task, context) {
  task.then(() => console.log(`[Mail] ${context} berhasil dikirim.`)).catch((error) => console.error(`[Mail Error] ${context} gagal:`, error?.message || error));
}
function queueVerificationEmail(user) {
  const link = buildClientLink("/verify-email", signEmailVerificationToken(user.id, user.email));
  const email = renderActionEmail({
    preheader: "Satu langkah lagi untuk mengaktifkan akun FITALENTA Anda.",
    title: "Verifikasi alamat email Anda",
    name: user.name,
    paragraphs: [
      "Terima kasih telah mendaftar di FITALENTA. Satu langkah lagi: verifikasi alamat email Anda untuk mengaktifkan akun dan mulai mendaftar program."
    ],
    buttonLabel: "Verifikasi Email",
    link,
    expiryNote: "Tautan verifikasi ini berlaku selama 24 jam sejak email ini dikirim.",
    outro: "Jika Anda tidak merasa mendaftar di FITALENTA, abaikan email ini. Tidak ada tindakan lebih lanjut yang diperlukan."
  });
  dispatch(deliver(user.email, "Verifikasi email akun FITALENTA", email), "Send verification email");
}
function queuePasswordResetEmail(user) {
  const link = buildClientLink("/reset-password", signPasswordResetToken(user));
  const email = renderActionEmail({
    preheader: "Buat password baru untuk akun FITALENTA Anda.",
    title: "Atur ulang password Anda",
    name: user.name,
    paragraphs: [
      "Kami menerima permintaan untuk mengatur ulang password akun FITALENTA Anda. Klik tombol di bawah untuk membuat password baru."
    ],
    buttonLabel: "Atur Ulang Password",
    link,
    expiryNote: `Tautan ini berlaku selama ${PASSWORD_RESET_TTL_MINUTES} menit sejak email ini dikirim.`,
    outro: "Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah. Demi keamanan, jangan bagikan tautan ini kepada siapa pun."
  });
  dispatch(deliver(user.email, "Reset password akun FITALENTA", email), "Send password reset email");
}

// src/services/auth.service.ts
var PRISMA_UNIQUE_VIOLATION = "P2002";
async function registerUser(data) {
  const email = data.email.trim().toLowerCase();
  const hashedPassword = await hashPassword(data.password);
  const existing = await prisma_default.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.emailVerifiedAt) {
      const updatedUser = await prisma_default.user.update({
        where: { id: existing.id },
        data: {
          password: hashedPassword,
          name: data.name.trim(),
          phone: data.phone.trim()
        }
      });
      queueVerificationEmail(updatedUser);
    }
    return;
  }
  try {
    const user = await prisma_default.user.create({
      data: {
        email,
        password: hashedPassword,
        name: data.name.trim(),
        phone: data.phone.trim(),
        role: "user"
      }
    });
    queueVerificationEmail(user);
  } catch (error) {
    if (error?.code === PRISMA_UNIQUE_VIOLATION) return;
    throw error;
  }
}
async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma_default.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    console.warn(`[Auth Warning] Login gagal: Email tidak terdaftar (${normalizedEmail})`);
    throw new Error("INVALID_CREDENTIALS");
  }
  const valid = await comparePassword(password, user.password);
  if (!valid) {
    console.warn(`[Auth Warning] Login gagal: Password tidak cocok untuk email (${normalizedEmail})`);
    throw new Error("INVALID_CREDENTIALS");
  }
  if (user.role === "user" && !user.emailVerifiedAt) {
    console.warn(`[Auth Warning] Login ditolak: Email belum diverifikasi (${normalizedEmail})`);
    throw new Error("EMAIL_NOT_VERIFIED");
  }
  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
}
async function verifyEmail(token) {
  let payload;
  try {
    payload = verifyEmailVerificationToken(token);
  } catch {
    throw new Error("INVALID_TOKEN");
  }
  const user = await prisma_default.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.email !== payload.email) throw new Error("INVALID_TOKEN");
  if (user.emailVerifiedAt) return;
  await prisma_default.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: /* @__PURE__ */ new Date() }
  });
}
async function resendVerification(email) {
  const user = await prisma_default.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (user && user.role === "user" && !user.emailVerifiedAt) queueVerificationEmail(user);
}

// src/utils/cookie.ts
var COOKIE_NAME = "access_token";
function getCookieDomain() {
  if (process.env.COOKIE_DOMAIN) {
    return process.env.COOKIE_DOMAIN;
  }
  if (process.env.NODE_ENV === "production") {
    return ".fitalenta.co.id";
  }
  return void 0;
}
function setAuthCookie(res, token) {
  const domain = getCookieDomain();
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1e3,
    path: "/"
  });
}
function clearAuthCookie(res) {
  const domain = getCookieDomain();
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain,
    path: "/"
  });
}

// src/controllers/auth.controller.ts
async function register(req, res) {
  try {
    const { email, password, confirmPassword, name, phone } = req.body || {};
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, phone, password, dan konfirmasi password wajib diisi"
      });
    }
    if ([name, email, phone, password, confirmPassword].some((v) => typeof v !== "string")) {
      return res.status(400).json({ success: false, message: "Format data tidak valid" });
    }
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ success: false, message: "Password harus 6-128 karakter" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Konfirmasi password tidak cocok" });
    }
    await registerUser({ email, password, name, phone });
    return res.status(200).json({
      success: true,
      message: "Jika email tersedia, link verifikasi telah dikirim. Silakan cek inbox Anda."
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
    }
    if (typeof email !== "string" || typeof password !== "string" || password.length > 128) {
      return res.status(400).json({ success: false, message: "Format data tidak valid" });
    }
    const { user, token } = await loginUser(email, password);
    setAuthCookie(res, token);
    return res.json({
      success: true,
      message: "Login berhasil",
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } }
    });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }
    if (error.message === "EMAIL_NOT_VERIFIED") {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Email belum diverifikasi. Silakan cek inbox Anda atau kirim ulang link verifikasi."
      });
    }
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function verifyEmailToken(req, res) {
  try {
    const { token } = req.body || {};
    if (typeof token !== "string" || !token || token.length > 2048) {
      return res.status(400).json({ success: false, message: "Token tidak valid" });
    }
    await verifyEmail(token);
    return res.json({ success: true, message: "Email berhasil diverifikasi. Silakan login." });
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(400).json({ success: false, message: "Link verifikasi tidak valid atau sudah kedaluwarsa" });
    }
    console.error("Verify email error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body || {};
    if (typeof email === "string" && email) await resendVerification(email);
    return res.json({
      success: true,
      message: "Jika email terdaftar dan belum terverifikasi, link verifikasi telah dikirim."
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function logout(req, res) {
  clearAuthCookie(res);
  return res.json({ success: true, message: "Logout berhasil" });
}
async function me(req, res) {
  try {
    const { userId, email, role } = req.user;
    const dbUser = await prisma_default.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });
    return res.json({
      success: true,
      data: {
        user: {
          userId,
          email,
          role,
          name: dbUser?.name ?? null
        }
      }
    });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/controllers/password.controller.ts
import { matchedData } from "express-validator";

// src/utils/app-error.ts
var AppError = class extends Error {
  constructor(code, status, message, details) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.name = "AppError";
  }
  code;
  status;
  details;
};

// src/errors/password.errors.ts
var PasswordErrors = {
  invalidCurrentPassword: () => new AppError("INVALID_CURRENT_PASSWORD", 400, "Password saat ini salah"),
  sameAsCurrent: () => new AppError("PASSWORD_UNCHANGED", 400, "Password baru tidak boleh sama dengan password saat ini"),
  invalidResetToken: () => new AppError("INVALID_RESET_TOKEN", 400, "Link reset password tidak valid atau sudah kedaluwarsa")
};

// src/errors/user.errors.ts
var UserErrors = {
  notFound: () => new AppError("USER_NOT_FOUND", 404, "User tidak ditemukan"),
  emailTaken: () => new AppError("EMAIL_TAKEN", 409, "Email sudah digunakan"),
  cannotDeleteSelf: () => new AppError("CANNOT_DELETE_SELF", 403, "Anda tidak dapat menghapus akun yang sedang digunakan"),
  cannotChangeOwnRole: () => new AppError("CANNOT_CHANGE_OWN_ROLE", 403, "Anda tidak dapat mengubah role akun sendiri"),
  hasRelatedData: () => new AppError(
    "USER_HAS_RELATED_DATA",
    409,
    "User tidak dapat dihapus karena masih memiliki data pendaftaran atau artikel"
  )
};

// src/services/password.service.ts
async function changePassword(userId, input) {
  const user = await prisma_default.user.findUnique({ where: { id: userId } });
  if (!user) throw UserErrors.notFound();
  if (!await comparePassword(input.currentPassword, user.password)) {
    throw PasswordErrors.invalidCurrentPassword();
  }
  if (input.currentPassword === input.newPassword) throw PasswordErrors.sameAsCurrent();
  await prisma_default.user.update({
    where: { id: userId },
    data: { password: await hashPassword(input.newPassword) }
  });
}
async function requestPasswordReset({ email }) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma_default.user.findUnique({ where: { email: normalized } });
  if (!user) {
    console.warn(`[Password Reset] Permintaan untuk email tidak terdaftar: ${normalized}`);
    return;
  }
  console.log(`[Password Reset] Mengirim email reset password ke: ${user.email} (ID: ${user.id})`);
  queuePasswordResetEmail(user);
}
async function resetPassword({ token, newPassword }) {
  const userId = readPasswordResetUserId(token);
  if (userId === null) {
    console.warn("[Password Reset] Gagal: Token reset tidak dapat dibaca userId-nya");
    throw PasswordErrors.invalidResetToken();
  }
  const user = await prisma_default.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.warn(`[Password Reset] Gagal: User dengan ID ${userId} tidak ditemukan`);
    throw PasswordErrors.invalidResetToken();
  }
  if (!isPasswordResetTokenValid(token, user)) {
    console.warn(`[Password Reset] Gagal: Token signature tidak valid untuk user ${user.email}`);
    throw PasswordErrors.invalidResetToken();
  }
  const { count } = await prisma_default.user.updateMany({
    where: { id: user.id, password: user.password },
    data: {
      password: await hashPassword(newPassword),
      emailVerifiedAt: user.emailVerifiedAt ?? /* @__PURE__ */ new Date()
    }
  });
  if (count === 0) {
    console.warn(`[Password Reset] Gagal: Concurrency update count === 0 untuk user ${user.email}`);
    throw PasswordErrors.invalidResetToken();
  }
  console.log(`[Password Reset] Berhasil memperbarui password untuk: ${user.email} (ID: ${user.id})`);
}

// src/controllers/password.controller.ts
async function change(req, res) {
  await changePassword(req.user.userId, matchedData(req));
  return res.json({ success: true, message: "Password berhasil diubah" });
}
async function forgot(req, res) {
  await requestPasswordReset(matchedData(req));
  return res.json({
    success: true,
    message: "Jika email terdaftar, link reset password telah dikirim. Silakan cek inbox Anda."
  });
}
async function reset(req, res) {
  await resetPassword(matchedData(req));
  return res.json({ success: true, message: "Password berhasil direset. Silakan login dengan password baru." });
}

// src/middlewares/authenticate.ts
function authenticate(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Tidak ada akses, silakan login terlebih dahulu"
    });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Sesi tidak valid atau sudah habis, silakan login ulang"
    });
  }
}

// src/middlewares/turnstile.ts
var VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
async function verifyTurnstile(req, res, next) {
  const secret2 = process.env.TURNSTILE_SECRET_KEY;
  if (!secret2) {
    return next();
  }
  const token = req.body?.turnstileToken;
  if (!token || typeof token !== "string" || token.length > 2048) {
    return res.status(400).json({
      success: false,
      code: "CAPTCHA_REQUIRED",
      message: "Verifikasi CAPTCHA wajib diisi"
    });
  }
  try {
    const body9 = new URLSearchParams({ secret: secret2, response: token });
    if (req.ip) body9.set("remoteip", req.ip);
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body: body9,
      signal: AbortSignal.timeout(5e3)
    });
    const result = await response.json();
    if (!result.success) {
      return res.status(400).json({
        success: false,
        code: "CAPTCHA_FAILED",
        message: "Verifikasi CAPTCHA gagal, silakan coba lagi"
      });
    }
    return next();
  } catch (error) {
    console.error("Turnstile verify error:", error);
    return res.status(503).json({ success: false, message: "Layanan verifikasi tidak tersedia" });
  }
}

// src/middlewares/validate.ts
import { validationResult } from "express-validator";

// src/utils/file.ts
import fs from "fs/promises";
import path2 from "path";
var UPLOADS_ROOT = path2.resolve(process.cwd(), "uploads");
function collectUploadedFiles(req) {
  if (req.files) {
    return Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
  }
  return req.file ? [req.file] : [];
}
async function removeFiles(files) {
  await Promise.allSettled(files.flatMap((file) => file.path ? [fs.unlink(file.path)] : []));
}
function toPublicUploadPath(folder, filename) {
  return `/uploads/${folder}/${filename}`;
}
function toUploadedPath(folder, file) {
  return file ? toPublicUploadPath(folder, file.filename) : void 0;
}
async function removePublicUpload(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const target = path2.resolve(process.cwd(), publicPath.slice(1));
  if (!target.startsWith(UPLOADS_ROOT + path2.sep)) return;
  await fs.unlink(target).catch(() => void 0);
}
async function withUploadCleanup(uploadedPath, task) {
  try {
    return await task();
  } catch (error) {
    await removePublicUpload(uploadedPath);
    throw error;
  }
}

// src/middlewares/validate.ts
function validate(rules) {
  return async (req, _res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const result = validationResult(req);
    if (result.isEmpty()) return next();
    await removeFiles(collectUploadedFiles(req));
    const errors = result.array({ onlyFirstError: true }).map((error) => ({
      field: error.type === "field" ? error.path : void 0,
      message: error.msg
    }));
    throw new AppError("VALIDATION_ERROR", 400, "Data yang dikirim tidak valid", errors);
  };
}

// src/middlewares/rateLimiter.ts
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
var MINUTE = 60 * 1e3;
var HOUR = 60 * MINUTE;
var MAX_EMAIL_KEY_LENGTH = 254;
function limiter(options4) {
  const { message, ...rest } = options4;
  return rateLimit({
    ...rest,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false
  });
}
function emailKey(req) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  return email ? `email:${email.slice(0, MAX_EMAIL_KEY_LENGTH)}` : ipKeyGenerator(req.ip ?? "");
}
function userKey(req) {
  return req.user ? `user:${req.user.userId}` : ipKeyGenerator(req.ip ?? "");
}
var contactRateLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 3,
  message: "Terlalu banyak pesan terkirim. Silakan coba lagi dalam beberapa menit."
});
var registerRateLimiter = limiter({
  windowMs: HOUR,
  limit: 10,
  message: "Terlalu banyak percobaan registrasi. Silakan coba lagi nanti."
});
var loginIpRateLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 30,
  message: "Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit."
});
var loginAccountRateLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: emailKey,
  message: { success: false, message: "Terlalu banyak percobaan login untuk akun ini. Silakan coba lagi dalam 15 menit." },
  standardHeaders: true,
  legacyHeaders: false
});
var emailVerificationRateLimiter = limiter({
  windowMs: HOUR,
  limit: 15,
  message: "Terlalu banyak permintaan. Silakan coba lagi nanti."
});
var forgotPasswordIpRateLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 20,
  message: "Terlalu banyak permintaan reset password. Silakan coba lagi dalam beberapa menit."
});
var forgotPasswordEmailRateLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 10,
  keyGenerator: emailKey,
  message: { success: false, message: "Terlalu banyak permintaan reset password untuk email ini. Silakan coba lagi dalam beberapa menit." },
  standardHeaders: true,
  legacyHeaders: false
});
var resetPasswordRateLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 20,
  message: "Terlalu banyak percobaan reset password. Silakan coba lagi dalam beberapa menit."
});
var changePasswordRateLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: userKey,
  message: { success: false, message: "Terlalu banyak percobaan ubah password. Silakan coba lagi dalam 15 menit." },
  standardHeaders: true,
  legacyHeaders: false
});

// src/validators/password.validator.ts
import { body } from "express-validator";
var TOKEN_MAX_LENGTH = 2048;
var currentPasswordRule = body("currentPassword").isString().withMessage("Password saat ini wajib diisi").bail().notEmpty().withMessage("Password saat ini wajib diisi").bail().isLength({ max: PASSWORD_MAX_LENGTH }).withMessage("Password saat ini tidak valid");
var newPasswordRule = body("newPassword").isString().withMessage("Password baru wajib diisi").bail().isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }).withMessage(`Password baru harus ${PASSWORD_MIN_LENGTH} sampai ${PASSWORD_MAX_LENGTH} karakter`);
var confirmPasswordRule = body("confirmPassword").optional({ values: "falsy" }).custom((value, { req }) => !value || value === req.body.newPassword).withMessage("Konfirmasi password tidak cocok");
var emailRule = body("email").isString().withMessage("Email wajib diisi").bail().trim().isEmail().withMessage("Format email tidak valid").bail().customSanitizer((value) => value.toLowerCase());
var tokenRule = body("token").isString().withMessage("Token wajib diisi").bail().isLength({ min: 1, max: TOKEN_MAX_LENGTH }).withMessage("Token tidak valid");
var changePasswordRules = [currentPasswordRule, newPasswordRule, confirmPasswordRule];
var forgotPasswordRules = [emailRule];
var resetPasswordRules = [tokenRule, newPasswordRule, confirmPasswordRule];

// src/routes/auth.routes.ts
var router = Router();
router.post("/register", registerRateLimiter, verifyTurnstile, register);
router.post(
  "/login",
  loginIpRateLimiter,
  verifyTurnstile,
  loginAccountRateLimiter,
  login
);
router.post("/verify-email", emailVerificationRateLimiter, verifyEmailToken);
router.post(
  "/resend-verification",
  emailVerificationRateLimiter,
  verifyTurnstile,
  resendVerificationEmail
);
router.post(
  "/forgot-password",
  forgotPasswordIpRateLimiter,
  verifyTurnstile,
  validate(forgotPasswordRules),
  forgotPasswordEmailRateLimiter,
  forgot
);
router.post("/reset-password", resetPasswordRateLimiter, validate(resetPasswordRules), reset);
router.post(
  "/change-password",
  authenticate,
  changePasswordRateLimiter,
  validate(changePasswordRules),
  change
);
router.post("/logout", logout);
router.get("/me", authenticate, me);
var auth_routes_default = router;

// src/routes/event.routes.ts
import { Router as Router2 } from "express";

// src/services/event.service.ts
import fs2 from "fs";
import path3 from "path";

// src/utils/slug.ts
function slugify(text) {
  return text.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

// src/services/event.service.ts
async function generateUniqueSlug(title, excludeId) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  while (await prisma_default.event.findFirst({
    where: { slug, ...excludeId ? { id: { not: excludeId } } : {} }
  })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}
async function getPublicEvents({ search, page = 1 }) {
  const perPage = 9;
  const skip = (page - 1) * perPage;
  const where = search ? {
    OR: [{ title: { contains: search } }, { description: { contains: search } }]
  } : {};
  const [events, total] = await Promise.all([
    prisma_default.event.findMany({
      where,
      include: { category: true },
      orderBy: { eventDate: "desc" },
      skip,
      take: perPage
    }),
    prisma_default.event.count({ where })
  ]);
  return {
    events,
    pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) }
  };
}
async function getFeaturedEvents(limit = 3) {
  return prisma_default.event.findMany({
    where: { isFeatured: true },
    orderBy: { eventDate: "asc" },
    take: limit,
    include: { category: true }
  });
}
async function getEventBySlug(slug, ipAddress, userAgent) {
  const event = await prisma_default.event.findUnique({
    where: { slug },
    include: { category: true }
  });
  if (!event) throw new Error("EVENT_NOT_FOUND");
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyViewed = await prisma_default.eventView.findFirst({
    where: { eventId: event.id, ipAddress, createdAt: { gte: today } }
  });
  if (!alreadyViewed) {
    await prisma_default.eventView.create({ data: { eventId: event.id, ipAddress, userAgent } });
    await prisma_default.event.update({ where: { id: event.id }, data: { views: { increment: 1 } } });
    event.views += 1;
  }
  return event;
}
async function getAdminEvents({ page = 1 }) {
  const perPage = 10;
  const skip = (page - 1) * perPage;
  const [events, total] = await Promise.all([
    prisma_default.event.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage
    }),
    prisma_default.event.count()
  ]);
  return { events, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
}
async function getEventById(id) {
  const event = await prisma_default.event.findUnique({ where: { id }, include: { category: true } });
  if (!event) throw new Error("EVENT_NOT_FOUND");
  return event;
}
async function createEvent(data, imagePath) {
  const slug = await generateUniqueSlug(data.title);
  return prisma_default.event.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      eventDate: new Date(data.eventDate),
      location: data.location,
      link: data.link,
      isFeatured: data.isFeatured ?? false,
      maxParticipants: data.maxParticipants,
      categoryId: data.categoryId,
      image: imagePath
    }
  });
}
async function updateEvent(id, data, imagePath) {
  const existing = await prisma_default.event.findUnique({ where: { id } });
  if (!existing) throw new Error("EVENT_NOT_FOUND");
  const slug = await generateUniqueSlug(data.title, id);
  if (imagePath && existing.image) {
    const oldPath = path3.join(process.cwd(), "uploads", "events", path3.basename(existing.image));
    if (fs2.existsSync(oldPath)) fs2.unlinkSync(oldPath);
  }
  return prisma_default.event.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      description: data.description,
      eventDate: new Date(data.eventDate),
      location: data.location,
      link: data.link,
      isFeatured: data.isFeatured ?? false,
      maxParticipants: data.maxParticipants,
      categoryId: data.categoryId,
      ...imagePath ? { image: imagePath } : {}
    }
  });
}
async function deleteEvent(id) {
  const existing = await prisma_default.event.findUnique({ where: { id } });
  if (!existing) throw new Error("EVENT_NOT_FOUND");
  if (existing.image) {
    const imgPath = path3.join(process.cwd(), "uploads", "events", path3.basename(existing.image));
    if (fs2.existsSync(imgPath)) fs2.unlinkSync(imgPath);
  }
  await prisma_default.event.delete({ where: { id } });
}
function generateGoogleCalendarUrl(event) {
  const formatDate2 = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    text: event.title,
    dates: `${formatDate2(event.eventDate)}/${formatDate2(event.eventDate)}`,
    details: `${event.description}

Detail: /events/${event.slug}`,
    location: event.location
  });
  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}

// src/utils/pagination.ts
function resolvePagination({ page = 1, limit = DEFAULT_PAGE_SIZE }) {
  return { page, limit, skip: (page - 1) * limit, take: limit };
}
function buildPaginationMeta(total, page, limit) {
  return { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
function parsePageQuery(value) {
  if (value === void 0 || value === "") return 1;
  if (!/^\d{1,6}$/.test(value)) return null;
  const page = Number(value);
  return page >= 1 ? page : null;
}
var INVALID_PAGE_RESPONSE = { success: false, message: "Parameter page tidak valid" };

// src/controllers/event.controller.ts
async function index(req, res) {
  try {
    const search = req.query.search;
    const page = parsePageQuery(typeof req.query.page === "string" ? req.query.page : void 0);
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);
    const result = await getPublicEvents({ search, page });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function featured(req, res) {
  try {
    const events = await getFeaturedEvents(3);
    return res.json({ success: true, data: events });
  } catch (error) {
    console.error("Get featured events error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show(req, res) {
  try {
    const slug = req.params.slug;
    const ipAddress = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const event = await getEventBySlug(slug, ipAddress, userAgent);
    const googleCalendarUrl = generateGoogleCalendarUrl(event);
    const relatedEvents = await getFeaturedEvents(3);
    return res.json({ success: true, data: { event, googleCalendarUrl, relatedEvents } });
  } catch (error) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Get event detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/event.routes.ts
var router2 = Router2();
router2.get("/", index);
router2.get("/featured", featured);
router2.get("/:slug", show);
var event_routes_default = router2;

// src/routes/admin/event.routes.ts
import { Router as Router3 } from "express";

// src/controllers/admin/event.controller.ts
async function index2(req, res) {
  try {
    const page = parsePageQuery(typeof req.query.page === "string" ? req.query.page : void 0);
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);
    const result = await getAdminEvents({ page });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get admin events error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show2(req, res) {
  try {
    const id = parseInt(req.params.id);
    const event = await getEventById(id);
    return res.json({ success: true, data: event });
  } catch (error) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Get event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function store(req, res) {
  try {
    const { title, description, eventDate, location, link, isFeatured, maxParticipants, categoryId } = req.body || {};
    if (!title || !description || !eventDate || !location || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, eventDate, location, dan categoryId wajib diisi"
      });
    }
    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : void 0;
    const event = await createEvent(
      {
        title,
        description,
        eventDate,
        location,
        link,
        isFeatured: isFeatured === "true" || isFeatured === true,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : void 0,
        categoryId: parseInt(categoryId)
      },
      imagePath
    );
    return res.status(201).json({ success: true, message: "Event berhasil dibuat", data: event });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { title, description, eventDate, location, link, isFeatured, maxParticipants, categoryId } = req.body || {};
    if (!title || !description || !eventDate || !location || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, eventDate, location, dan categoryId wajib diisi"
      });
    }
    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : void 0;
    const event = await updateEvent(
      id,
      {
        title,
        description,
        eventDate,
        location,
        link,
        isFeatured: isFeatured === "true" || isFeatured === true,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : void 0,
        categoryId: parseInt(categoryId)
      },
      imagePath
    );
    return res.json({ success: true, message: "Event berhasil diperbarui", data: event });
  } catch (error) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Update event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function destroy(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deleteEvent(id);
    return res.json({ success: true, message: "Event berhasil dihapus" });
  } catch (error) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Delete event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/config/access.config.ts
var SUPER_ADMIN_ROLES = ["superadmin", "admin"];
var CMS_ROLES = ["superadmin", "admin", "editor"];

// src/middlewares/authorize.ts
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk resource ini"
      });
    }
    next();
  };
}

// src/middlewares/access.ts
var cmsAccess = [authenticate, authorize(...CMS_ROLES)];
var superAdminAccess = [authenticate, authorize(...SUPER_ADMIN_ROLES)];

// src/middlewares/upload.ts
import multer from "multer";
import path4 from "path";
import fs3 from "fs";

// src/config/team.config.ts
var TEAM_MEMBER_UPLOAD_FOLDER = "team-members";
var EXPERT_LIMITS = {
  name: 191,
  position: 191,
  bio: 5e3,
  order: 9999,
  reorderItems: 200
};

// src/config/registration.config.ts
var REGISTRATION_CODE_FORMAT = { prefix: "FTL", scope: "year", pad: 4 };
var INVOICE_CODE_FORMAT = { prefix: "INV", scope: "month", pad: 5 };
var REGISTRATION_TIMEZONE_OFFSET_HOURS = 7;
var MAX_CODE_COLLISION_RETRIES = 3;
var NIK_PATTERN = /^\d{16}$/;
var PHONE_PATTERN = /^(\+62|62|0)8\d{7,12}$/;
var REGISTRATION_FILES = [
  { field: "photo", column: "photoPath", label: "Pas foto", required: true },
  { field: "n4Certificate", column: "n4CertificatePath", label: "Sertifikat N4", required: false },
  { field: "sswCertificate", column: "sswCertificatePath", label: "Sertifikat SSW", required: false }
];
var REGISTRATION_UPLOAD_FOLDER = "registrations";
var REGISTRATION_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
];
var REGISTRATION_FEE = {
  amount: 3e5,
  description: (programName) => `Biaya pendaftaran program ${programName}`,
  defaultNotes: (programName) => `Biaya pendaftaran program ${programName}. Pembayaran ini merupakan biaya pendaftaran awal dan administrasi seleksi peserta.`
};

// src/config/financial-report.config.ts
var REPORT_SHEET_NAME = "Laporan Keuangan";
var REPORT_INSTRUCTION_SHEET_NAME = "Petunjuk";
var REPORT_HEADER_FILL = "FFE6E6FA";
var XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var REPORT_COLUMNS = [
  { key: "no", header: "No", width: 6 },
  { key: "invoiceNumber", header: "Invoice Number", width: 22 },
  { key: "receiptNumber", header: "Receipt Number", width: 22 },
  { key: "participantName", header: "Nama Peserta", width: 28 },
  { key: "email", header: "Email", width: 30 },
  { key: "program", header: "Program", width: 30 },
  { key: "amount", header: "Amount", width: 16 },
  { key: "amountPaid", header: "Amount Paid", width: 16 },
  { key: "status", header: "Status", width: 16 },
  { key: "termin", header: "Termin", width: 26 },
  { key: "paymentMethod", header: "Payment Method", width: 18 },
  { key: "paymentDate", header: "Payment Date", width: 18 },
  { key: "createdAt", header: "Created At", width: 20 }
];
var REPORT_REQUIRED_COLUMNS = ["email", "program", "amount"];
var PAYMENT_STATUS_LABELS = {
  pending: "Belum Bayar",
  installment_1: "Cicilan 1",
  installment_2: "Cicilan 2",
  installment_3: "Cicilan 3",
  installment_4: "Cicilan 4",
  installment_5: "Cicilan 5",
  installment_6: "Cicilan 6",
  paid: "Lunas",
  overdue: "Jatuh Tempo",
  cancelled: "Dibatalkan"
};
var PAYMENT_METHOD_LABELS = {
  transfer: "Transfer",
  cash: "Tunai",
  credit_card: "Kartu Kredit"
};
var TERMIN_TYPES = ["cash", "installment"];
var TERMIN_TYPE_LABELS = {
  cash: "Tunai (Sekali Bayar)",
  installment: "Cicilan"
};
var IMPORT_LIMITS = {
  maxFileSizeMB: 5,
  maxRows: 500,
  maxReturnedErrors: 200,
  transactionTimeoutMs: 6e4
};
var EXPORT_MAX_ROWS = 2e4;
var IMPORT_HISTORY_NOTE = "Diimpor dari file Excel";

// src/config/payment.config.ts
var RECEIPT_CODE_FORMAT = { prefix: "RCP", scope: "month", pad: 5 };
var PAYMENT_LIMITS = {
  notes: 5e3,
  amountMax: 999999999999,
  installmentMin: 2,
  installmentMax: 6
};
var PAYMENT_PROOF_UPLOAD_FOLDER = "payment-proofs";
var PAYMENT_PROOF_HISTORY_NOTES = {
  uploaded: "Bukti pembayaran diunggah peserta",
  replaced: "Bukti pembayaran diganti peserta"
};
var SETTLED_PAYMENT_STATUSES = ["paid", "cancelled"];
var INVOICE_STATE_VALUES = ["draft", "issued"];
var INVOICE_ISSUER = {
  name: "PT FAST Indo Talenta",
  addressLines: [
    "Gedung Science and Techno Park ITB",
    "Jl. Ganesa No.15E, Lb. Siliwangi, Kec. Coblong Bandung 40132"
  ],
  phone: "+62 81110119273",
  website: "fitalenta.co.id",
  city: "Bandung",
  bank: { name: "BCA", accountNumber: "2828339333" },
  signatory: { name: "Ii Ratna Yanti Kosasih, S.Si., M.Sc.", title: "General Manager" },
  motto: "Fathanah  | Amanah | Shiddiq | Tabligh",
  letterCode: "INV/FITALENTA",
  paymentDeadlineTime: "23.59"
};
var INVOICE_ASSETS = {
  folder: ["assets", "invoice"],
  logo: "logo.png",
  signature: "signature.jpg"
};

// src/middlewares/upload.ts
var IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
function createUploader(folder, options4 = {}) {
  const {
    allowedMimeTypes = IMAGE_MIME_TYPES,
    invalidTypeMessage = "Format gambar tidak didukung (hanya JPG, PNG, WEBP, GIF)",
    maxFileSizeMB = 5
  } = options4;
  const uploadPath = path4.join(process.cwd(), "uploads", folder);
  if (!fs3.existsSync(uploadPath)) {
    fs3.mkdirSync(uploadPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path4.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    }
  });
  return multer({
    storage,
    limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
      else cb(new AppError("INVALID_FILE_TYPE", 400, invalidTypeMessage));
    }
  });
}
var uploadEventImage = createUploader("events");
var uploadArticleImage = createUploader("articles");
var uploadGalleryImage = createUploader("gallery");
var uploadTestimonialImage = createUploader("testimonials");
var uploadTeamMemberImage = createUploader(TEAM_MEMBER_UPLOAD_FOLDER);
var uploadPaymentProof = createUploader(PAYMENT_PROOF_UPLOAD_FOLDER);
var uploadRegistrationFiles = createUploader(REGISTRATION_UPLOAD_FOLDER, {
  allowedMimeTypes: REGISTRATION_ALLOWED_MIME_TYPES,
  invalidTypeMessage: "Format file tidak didukung (hanya JPG, PNG, WEBP, PDF)"
}).fields(REGISTRATION_FILES.map(({ field }) => ({ name: field, maxCount: 1 })));
var SPREADSHEET_MIME_TYPES = [XLSX_MIME, "application/octet-stream"];
var uploadReportSpreadsheet = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMPORT_LIMITS.maxFileSizeMB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const isXlsx = path4.extname(file.originalname).toLowerCase() === ".xlsx" && SPREADSHEET_MIME_TYPES.includes(file.mimetype);
    if (isXlsx) cb(null, true);
    else cb(new AppError("INVALID_FILE_TYPE", 400, "Format file harus Excel (.xlsx)"));
  }
});
var uploadParticipantSpreadsheet = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const isXlsx = path4.extname(file.originalname).toLowerCase() === ".xlsx" && SPREADSHEET_MIME_TYPES.includes(file.mimetype);
    if (isXlsx) cb(null, true);
    else cb(new AppError("INVALID_FILE_TYPE", 400, "Format file harus Excel (.xlsx)"));
  }
});

// src/routes/admin/event.routes.ts
var router3 = Router3();
router3.use(...cmsAccess);
router3.get("/", index2);
router3.get("/:id", show2);
router3.post("/", uploadEventImage.single("image"), store);
router3.put("/:id", uploadEventImage.single("image"), update);
router3.delete("/:id", destroy);
var event_routes_default2 = router3;

// src/routes/article.routes.ts
import { Router as Router4 } from "express";

// src/services/article.service.ts
import fs4 from "fs";
import path5 from "path";
async function generateUniqueSlug2(title, excludeId) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  while (await prisma_default.article.findFirst({
    where: { slug, ...excludeId ? { id: { not: excludeId } } : {} }
  })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}
async function getPublicArticles({ search, categoryId, page = 1 }) {
  const perPage = 7;
  const skip = (page - 1) * perPage;
  const where = {
    eventDate: { not: null, lte: /* @__PURE__ */ new Date() },
    ...categoryId ? { categoryId } : {},
    ...search ? {
      OR: [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } }
      ]
    } : {}
  };
  const [articles, total] = await Promise.all([
    prisma_default.article.findMany({
      where,
      include: { category: true, author: { select: { id: true, name: true } } },
      orderBy: { eventDate: "desc" },
      skip,
      take: perPage
    }),
    prisma_default.article.count({ where })
  ]);
  return {
    articles,
    pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) }
  };
}
async function getFeaturedArticles(limit = 3) {
  return prisma_default.article.findMany({
    where: { isFeatured: true, eventDate: { not: null, lte: /* @__PURE__ */ new Date() } },
    orderBy: { eventDate: "desc" },
    take: limit,
    include: { category: true }
  });
}
async function getArticleBySlug(slug, ipAddress, userAgent) {
  const article = await prisma_default.article.findUnique({
    where: { slug },
    include: { category: true, author: { select: { id: true, name: true } } }
  });
  if (!article) throw new Error("ARTICLE_NOT_FOUND");
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyViewed = await prisma_default.articleView.findFirst({
    where: { articleId: article.id, ipAddress, createdAt: { gte: today } }
  });
  if (!alreadyViewed) {
    await prisma_default.articleView.create({ data: { articleId: article.id, ipAddress, userAgent } });
    await prisma_default.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });
    article.views += 1;
  }
  const relatedArticles = await prisma_default.article.findMany({
    where: {
      id: { not: article.id },
      eventDate: { not: null, lte: /* @__PURE__ */ new Date() }
    },
    orderBy: { eventDate: "desc" },
    take: 3
  });
  return { article, relatedArticles };
}
async function getAdminArticles({ page = 1 }) {
  const perPage = 10;
  const skip = (page - 1) * perPage;
  const [articles, total] = await Promise.all([
    prisma_default.article.findMany({
      include: { category: true, author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage
    }),
    prisma_default.article.count()
  ]);
  return { articles, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
}
async function getArticleById(id) {
  const article = await prisma_default.article.findUnique({
    where: { id },
    include: { category: true, author: { select: { id: true, name: true } } }
  });
  if (!article) throw new Error("ARTICLE_NOT_FOUND");
  return article;
}
async function createArticle(data, imagePath) {
  const slug = await generateUniqueSlug2(data.title);
  return prisma_default.article.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      eventDate: data.eventDate ? new Date(data.eventDate) : void 0,
      isFeatured: data.isFeatured ?? false,
      categoryId: data.categoryId ?? 2,
      authorId: data.authorId,
      image: imagePath
    }
  });
}
async function updateArticle(id, data, imagePath) {
  const existing = await prisma_default.article.findUnique({ where: { id } });
  if (!existing) throw new Error("ARTICLE_NOT_FOUND");
  const slug = await generateUniqueSlug2(data.title, id);
  if (imagePath && existing.image) {
    const oldPath = path5.join(process.cwd(), "uploads", "articles", path5.basename(existing.image));
    if (fs4.existsSync(oldPath)) fs4.unlinkSync(oldPath);
  }
  return prisma_default.article.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      eventDate: data.eventDate ? new Date(data.eventDate) : void 0,
      isFeatured: data.isFeatured ?? false,
      categoryId: data.categoryId ?? 2,
      ...imagePath ? { image: imagePath } : {}
    }
  });
}
async function deleteArticle(id) {
  const existing = await prisma_default.article.findUnique({ where: { id } });
  if (!existing) throw new Error("ARTICLE_NOT_FOUND");
  if (existing.image) {
    const imgPath = path5.join(process.cwd(), "uploads", "articles", path5.basename(existing.image));
    if (fs4.existsSync(imgPath)) fs4.unlinkSync(imgPath);
  }
  await prisma_default.article.delete({ where: { id } });
}

// src/utils/request.ts
function getStringParam(req, key) {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}
function getStringQuery(req, key) {
  const value = req.query[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

// src/controllers/article.controller.ts
async function index3(req, res) {
  try {
    const search = getStringQuery(req, "search");
    const categoryId = getStringQuery(req, "categoryId");
    const page = parsePageQuery(getStringQuery(req, "page"));
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);
    const result = await getPublicArticles({
      search,
      categoryId: categoryId ? parseInt(categoryId) : void 0,
      page: page ? parseInt(page.toString()) : 1
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get articles error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function featured2(req, res) {
  try {
    const articles = await getFeaturedArticles(3);
    return res.json({ success: true, data: articles });
  } catch (error) {
    console.error("Get featured articles error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show3(req, res) {
  try {
    const slug = getStringParam(req, "slug");
    const ipAddress = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const result = await getArticleBySlug(slug, ipAddress, userAgent);
    return res.json({ success: true, data: result });
  } catch (error) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Get article detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/article.routes.ts
var router4 = Router4();
router4.get("/", index3);
router4.get("/featured", featured2);
router4.get("/:slug", show3);
var article_routes_default = router4;

// src/routes/admin/article.routes.ts
import { Router as Router5 } from "express";

// src/controllers/admin/article.controller.ts
async function index4(req, res) {
  try {
    const page = parsePageQuery(getStringQuery(req, "page"));
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);
    const result = await getAdminArticles({ page });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get admin articles error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show4(req, res) {
  try {
    const id = parseInt(req.params.id);
    const article = await getArticleById(id);
    return res.json({ success: true, data: article });
  } catch (error) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Get article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function store2(req, res) {
  try {
    const { title, content, excerpt, eventDate, isFeatured, categoryId } = req.body || {};
    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title, content, dan excerpt wajib diisi"
      });
    }
    const imagePath = req.file ? `/uploads/articles/${req.file.filename}` : void 0;
    const article = await createArticle(
      {
        title,
        content,
        excerpt,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        categoryId: categoryId ? parseInt(categoryId) : void 0,
        authorId: req.user.userId
      },
      imagePath
    );
    return res.status(201).json({ success: true, message: "Artikel berhasil dibuat", data: article });
  } catch (error) {
    console.error("Create article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function update2(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { title, content, excerpt, eventDate, isFeatured, categoryId } = req.body || {};
    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title, content, dan excerpt wajib diisi"
      });
    }
    const imagePath = req.file ? `/uploads/articles/${req.file.filename}` : void 0;
    const article = await updateArticle(
      id,
      {
        title,
        content,
        excerpt,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        categoryId: categoryId ? parseInt(categoryId) : void 0,
        authorId: req.user.userId
      },
      imagePath
    );
    return res.json({ success: true, message: "Artikel berhasil diperbarui", data: article });
  } catch (error) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Update article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function destroy2(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deleteArticle(id);
    return res.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (error) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Delete article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/admin/article.routes.ts
var router5 = Router5();
router5.use(...cmsAccess);
router5.get("/", index4);
router5.get("/:id", show4);
router5.post("/", uploadArticleImage.single("image"), store2);
router5.put("/:id", uploadArticleImage.single("image"), update2);
router5.delete("/:id", destroy2);
var article_routes_default2 = router5;

// src/routes/contact.routes.ts
import { Router as Router6 } from "express";

// src/utils/templates/email/contactEmail.ts
var { colors: colors2, fontStack: fontStack2 } = EMAIL_BRAND;
function detailRows(rows) {
  const cells = rows.map(([label, value, href], index22) => {
    const border = index22 === rows.length - 1 ? "" : `border-bottom:1px solid ${colors2.border};`;
    const content = href ? `<a href="${escapeHtml(href)}" style="color:${colors2.primary};text-decoration:none;">${escapeHtml(value)}</a>` : escapeHtml(value);
    return `
        <tr>
          <td width="110" valign="top" style="padding:11px 16px;${border}font-family:${fontStack2};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${colors2.muted};">${escapeHtml(label)}</td>
          <td valign="top" style="padding:11px 16px;${border}font-family:${fontStack2};font-size:14px;line-height:1.5;color:${colors2.heading};">${content}</td>
        </tr>`;
  }).join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border:1px solid ${colors2.border};border-radius:10px;background:${colors2.soft};">
      ${cells}
    </table>`;
}
function renderContactEmail({ name, email, subject, message, phone, company }) {
  const rows = [
    ["Nama", name],
    ["Email", email, `mailto:${email}`]
  ];
  if (phone) rows.push(["Telepon", phone, `tel:${phone.replace(/[^\d+]/g, "")}`]);
  if (company) rows.push(["Perusahaan", company]);
  rows.push(["Subjek", subject]);
  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const bodyHtml = [
    emailParts.heading("Pesan baru dari website"),
    emailParts.paragraph("Seseorang baru saja mengirim pesan melalui formulir kontak FITALENTA."),
    detailRows(rows),
    `<p style="margin:0 0 8px;font-family:${fontStack2};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${colors2.muted};">Pesan</p>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:16px 18px;background:${colors2.soft};border-left:4px solid ${colors2.primary};border-radius:0 10px 10px 0;font-family:${fontStack2};font-size:15px;line-height:1.7;color:${colors2.text};">${messageHtml}</td></tr></table>`,
    emailParts.button("Balas Pesan", replyHref),
    emailParts.divider(),
    emailParts.smallText("Anda juga bisa membalas email ini langsung; balasan akan dikirim ke alamat pengirim.")
  ].join("\n");
  const html = renderEmailLayout({
    title: `Pesan baru dari ${name}`,
    preheader: `${name}: ${subject}`,
    bodyHtml
  });
  const text = [
    "Pesan baru dari website",
    "",
    `Nama: ${name}`,
    `Email: ${email}`,
    ...phone ? [`Telepon: ${phone}`] : [],
    ...company ? [`Perusahaan: ${company}`] : [],
    `Subjek: ${subject}`,
    "",
    "Pesan:",
    message,
    "",
    "Anda dapat membalas email ini langsung; balasan akan dikirim ke alamat pengirim.",
    "",
    renderTextFooter()
  ].join("\n");
  return { html, text };
}

// src/services/contact.service.ts
async function submitContactMessage(data) {
  const contactMessage = await prisma_default.contactMessage.create({ data });
  const { html, text } = renderContactEmail(data);
  const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER || "info@fitalenta.co.id";
  await sendMail({
    to,
    from: process.env.CONTACT_EMAIL_FROM,
    replyTo: data.email,
    subject: `[Contact Form] ${data.subject}`,
    html,
    text
  });
  return contactMessage;
}

// src/controllers/contact.controller.ts
async function submit(req, res) {
  try {
    const { name, email, subject, message, phone, company } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, subjek, dan pesan wajib diisi"
      });
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, message: "Pesan minimal 10 karakter" });
    }
    await submitContactMessage({ name, email, subject, message, phone, company });
    return res.status(201).json({
      success: true,
      message: "Terima kasih atas pesan Anda. Kami akan segera menghubungi Anda kembali."
    });
  } catch (error) {
    console.error("Contact submit error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengirim pesan, silakan coba lagi" });
  }
}

// src/routes/contact.routes.ts
var router6 = Router6();
router6.post("/", contactRateLimiter, submit);
var contact_routes_default = router6;

// src/routes/service.routes.ts
import { Router as Router7 } from "express";

// src/services/service.service.ts
async function getPublicServices() {
  return prisma_default.service.findMany({
    select: { slug: true, title: true, icon: true, summary: true, content: true },
    orderBy: { createdAt: "desc" }
  });
}
async function getServiceBySlug(slug, ipAddress, userAgent) {
  const service = await prisma_default.service.findUnique({ where: { slug } });
  if (!service) throw new Error("SERVICE_NOT_FOUND");
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyViewed = await prisma_default.serviceView.findFirst({
    where: { serviceId: service.id, ipAddress, createdAt: { gte: today } }
  });
  if (!alreadyViewed) {
    await prisma_default.serviceView.create({ data: { serviceId: service.id, ipAddress, userAgent } });
    await prisma_default.service.update({ where: { id: service.id }, data: { views: { increment: 1 } } });
    service.views += 1;
  }
  return service;
}
async function getAdminServices({ page = 1 }) {
  const perPage = 10;
  const skip = (page - 1) * perPage;
  const [services, total] = await Promise.all([
    prisma_default.service.findMany({ orderBy: { createdAt: "desc" }, skip, take: perPage }),
    prisma_default.service.count()
  ]);
  return { services, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
}
async function getAdminServiceById(id) {
  const service = await prisma_default.service.findUnique({ where: { id } });
  if (!service) throw new Error("SERVICE_NOT_FOUND");
  return service;
}
async function createService(data) {
  return prisma_default.service.create({ data: { ...data, content: data.content } });
}
async function updateService(id, data) {
  const existing = await prisma_default.service.findUnique({ where: { id } });
  if (!existing) throw new Error("SERVICE_NOT_FOUND");
  return prisma_default.service.update({
    where: { id },
    data: { ...data, content: data.content }
  });
}
async function deleteService(id) {
  const existing = await prisma_default.service.findUnique({ where: { id } });
  if (!existing) throw new Error("SERVICE_NOT_FOUND");
  await prisma_default.service.delete({ where: { id } });
}

// src/controllers/service.controller.ts
async function index5(req, res) {
  try {
    const services = await getPublicServices();
    return res.json({ success: true, data: services });
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show5(req, res) {
  try {
    const slug = req.params.slug;
    const ipAddress = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const service = await getServiceBySlug(slug, ipAddress, userAgent);
    return res.json({ success: true, data: service });
  } catch (error) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    console.error("Get service detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/service.routes.ts
var router7 = Router7();
router7.get("/", index5);
router7.get("/:slug", show5);
var service_routes_default = router7;

// src/routes/admin/service.routes.ts
import { Router as Router8 } from "express";

// src/controllers/admin/service.controller.ts
async function index6(req, res) {
  try {
    const pageParam = getStringQuery(req, "page");
    const result = await getAdminServices({ page: pageParam ? parseInt(pageParam) : 1 });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get admin services error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show6(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    const service = await getAdminServiceById(id);
    return res.json({ success: true, data: service });
  } catch (error) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    console.error("Get admin service detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function store3(req, res) {
  try {
    const { slug, title, icon, summary: summary9, content, isFeatured } = req.body || {};
    if (!slug || !title || !summary9 || !content) {
      return res.status(400).json({ success: false, message: "Slug, title, summary, dan content wajib diisi" });
    }
    const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
    const service = await createService({
      slug,
      title,
      icon,
      summary: summary9,
      content: parsedContent,
      isFeatured: isFeatured === "true" || isFeatured === true
    });
    return res.status(201).json({ success: true, message: "Layanan berhasil dibuat", data: service });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Slug sudah digunakan" });
    }
    console.error("Create service error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function update3(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { slug, title, icon, summary: summary9, content, isFeatured } = req.body || {};
    if (!slug || !title || !summary9 || !content) {
      return res.status(400).json({ success: false, message: "Slug, title, summary, dan content wajib diisi" });
    }
    const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
    const service = await updateService(id, {
      slug,
      title,
      icon,
      summary: summary9,
      content: parsedContent,
      isFeatured: isFeatured === "true" || isFeatured === true
    });
    return res.json({ success: true, message: "Layanan berhasil diperbarui", data: service });
  } catch (error) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Slug sudah digunakan" });
    }
    console.error("Update service error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function destroy3(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deleteService(id);
    return res.json({ success: true, message: "Layanan berhasil dihapus" });
  } catch (error) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    console.error("Delete service error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/admin/service.routes.ts
var router8 = Router8();
router8.use(...cmsAccess);
router8.get("/", index6);
router8.get("/:id", show6);
router8.post("/", store3);
router8.put("/:id", update3);
router8.delete("/:id", destroy3);
var service_routes_default2 = router8;

// src/routes/gallery.routes.ts
import { Router as Router9 } from "express";

// src/services/gallery.service.ts
import fs5 from "fs";
import path6 from "path";
async function getPublicGallery() {
  return prisma_default.gallery.findMany({
    where: { isFeatured: false },
    include: { category: true },
    orderBy: { eventDate: "desc" }
  });
}
async function getGalleryById(id) {
  const image = await prisma_default.gallery.findUnique({ where: { id }, include: { category: true } });
  if (!image) throw new Error("GALLERY_NOT_FOUND");
  const relatedImages = await prisma_default.gallery.findMany({ where: { isFeatured: true }, take: 3 });
  return { image, relatedImages };
}
async function getAdminGallery() {
  return prisma_default.gallery.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
}
async function createGalleryItem(data, imagePath) {
  return prisma_default.gallery.create({
    data: {
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : void 0,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? 0,
      image: imagePath
    }
  });
}
async function updateGalleryItem(id, data, imagePath) {
  const existing = await prisma_default.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error("GALLERY_NOT_FOUND");
  if (imagePath && existing.image) {
    const oldPath = path6.join(process.cwd(), "uploads", "gallery", path6.basename(existing.image));
    if (fs5.existsSync(oldPath)) fs5.unlinkSync(oldPath);
  }
  return prisma_default.gallery.update({
    where: { id },
    data: {
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : void 0,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? existing.order,
      ...imagePath ? { image: imagePath } : {}
    }
  });
}
async function deleteGalleryItem(id) {
  const existing = await prisma_default.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error("GALLERY_NOT_FOUND");
  const imgPath = path6.join(process.cwd(), "uploads", "gallery", path6.basename(existing.image));
  if (fs5.existsSync(imgPath)) fs5.unlinkSync(imgPath);
  await prisma_default.gallery.delete({ where: { id } });
}

// src/controllers/gallery.controller.ts
async function index7(req, res) {
  try {
    const gallery = await getPublicGallery();
    return res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Get gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show7(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await getGalleryById(id);
    return res.json({ success: true, data: result });
  } catch (error) {
    if (error.message === "GALLERY_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
    }
    console.error("Get gallery detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/gallery.routes.ts
var router9 = Router9();
router9.get("/", index7);
router9.get("/:id", show7);
var gallery_routes_default = router9;

// src/routes/admin/gallery.routes.ts
import { Router as Router10 } from "express";

// src/controllers/admin/gallery.controller.ts
async function index8(req, res) {
  try {
    const gallery = await getAdminGallery();
    return res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Get admin gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function store4(req, res) {
  try {
    const { title, categoryId, description, eventDate, isFeatured, order } = req.body || {};
    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: "Title dan categoryId wajib diisi" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Gambar wajib diunggah" });
    }
    const imagePath = `/uploads/gallery/${req.file.filename}`;
    const item = await createGalleryItem(
      {
        title,
        categoryId: parseInt(categoryId),
        description,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        order: order ? parseInt(order) : void 0
      },
      imagePath
    );
    return res.status(201).json({ success: true, message: "Gambar berhasil diunggah", data: item });
  } catch (error) {
    console.error("Create gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function update4(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { title, categoryId, description, eventDate, isFeatured, order } = req.body || {};
    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: "Title dan categoryId wajib diisi" });
    }
    const imagePath = req.file ? `/uploads/gallery/${req.file.filename}` : void 0;
    const item = await updateGalleryItem(
      id,
      {
        title,
        categoryId: parseInt(categoryId),
        description,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        order: order ? parseInt(order) : void 0
      },
      imagePath
    );
    return res.json({ success: true, message: "Gambar berhasil diperbarui", data: item });
  } catch (error) {
    if (error.message === "GALLERY_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
    }
    console.error("Update gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function destroy4(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deleteGalleryItem(id);
    return res.json({ success: true, message: "Gambar berhasil dihapus" });
  } catch (error) {
    if (error.message === "GALLERY_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
    }
    console.error("Delete gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/admin/gallery.routes.ts
var router10 = Router10();
router10.use(...cmsAccess);
router10.get("/", index8);
router10.post("/", uploadGalleryImage.single("image"), store4);
router10.put("/:id", uploadGalleryImage.single("image"), update4);
router10.delete("/:id", destroy4);
var gallery_routes_default2 = router10;

// src/routes/testimonial.routes.ts
import { Router as Router11 } from "express";

// src/services/testimonial.service.ts
import fs6 from "fs";
import path7 from "path";
async function getPublicTestimonials() {
  return prisma_default.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}
async function getAdminTestimonials() {
  return prisma_default.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}
async function createTestimonial(data, imagePath) {
  return prisma_default.testimonial.create({ data: { ...data, image: imagePath } });
}
async function updateTestimonial(id, data, imagePath) {
  const existing = await prisma_default.testimonial.findUnique({ where: { id } });
  if (!existing) throw new Error("TESTIMONIAL_NOT_FOUND");
  if (imagePath && existing.image) {
    const oldPath = path7.join(process.cwd(), "uploads", "testimonials", path7.basename(existing.image));
    if (fs6.existsSync(oldPath)) fs6.unlinkSync(oldPath);
  }
  return prisma_default.testimonial.update({
    where: { id },
    data: { ...data, ...imagePath ? { image: imagePath } : {} }
  });
}
async function deleteTestimonial(id) {
  const existing = await prisma_default.testimonial.findUnique({ where: { id } });
  if (!existing) throw new Error("TESTIMONIAL_NOT_FOUND");
  if (existing.image) {
    const imgPath = path7.join(process.cwd(), "uploads", "testimonials", path7.basename(existing.image));
    if (fs6.existsSync(imgPath)) fs6.unlinkSync(imgPath);
  }
  await prisma_default.testimonial.delete({ where: { id } });
}
async function toggleTestimonial(id) {
  const existing = await prisma_default.testimonial.findUnique({ where: { id } });
  if (!existing) throw new Error("TESTIMONIAL_NOT_FOUND");
  return prisma_default.testimonial.update({ where: { id }, data: { isFeatured: !existing.isFeatured } });
}

// src/controllers/testimonial.controller.ts
async function index9(req, res) {
  try {
    const testimonials = await getPublicTestimonials();
    return res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Get testimonials error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/testimonial.routes.ts
var router11 = Router11();
router11.get("/", index9);
var testimonial_routes_default = router11;

// src/routes/admin/testimonial.routes.ts
import { Router as Router12 } from "express";

// src/controllers/admin/testimonial.controller.ts
async function index10(req, res) {
  try {
    const testimonials = await getAdminTestimonials();
    return res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Get admin testimonials error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function store5(req, res) {
  try {
    const { clientName, company, content, rating } = req.body || {};
    if (!clientName || !company || !content || !rating) {
      return res.status(400).json({ success: false, message: "Client name, company, content, dan rating wajib diisi" });
    }
    const imagePath = req.file ? `/uploads/testimonials/${req.file.filename}` : void 0;
    const testimonial = await createTestimonial(
      { clientName, company, content, rating: parseInt(rating) },
      imagePath
    );
    return res.status(201).json({ success: true, message: "Testimoni berhasil ditambahkan", data: testimonial });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function update5(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { clientName, company, content, rating } = req.body || {};
    if (!clientName || !company || !content || !rating) {
      return res.status(400).json({ success: false, message: "Client name, company, content, dan rating wajib diisi" });
    }
    const imagePath = req.file ? `/uploads/testimonials/${req.file.filename}` : void 0;
    const testimonial = await updateTestimonial(
      id,
      { clientName, company, content, rating: parseInt(rating) },
      imagePath
    );
    return res.json({ success: true, message: "Testimoni berhasil diperbarui", data: testimonial });
  } catch (error) {
    if (error.message === "TESTIMONIAL_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan" });
    }
    console.error("Update testimonial error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function destroy5(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deleteTestimonial(id);
    return res.json({ success: true, message: "Testimoni berhasil dihapus" });
  } catch (error) {
    if (error.message === "TESTIMONIAL_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan" });
    }
    console.error("Delete testimonial error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function toggle(req, res) {
  try {
    const id = parseInt(req.params.id);
    const testimonial = await toggleTestimonial(id);
    return res.json({ success: true, message: "Status testimoni berhasil diubah", data: testimonial });
  } catch (error) {
    if (error.message === "TESTIMONIAL_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan" });
    }
    console.error("Toggle testimonial error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/admin/testimonial.routes.ts
var router12 = Router12();
router12.use(...cmsAccess);
router12.get("/", index10);
router12.post("/", uploadTestimonialImage.single("image"), store5);
router12.put("/:id", uploadTestimonialImage.single("image"), update5);
router12.delete("/:id", destroy5);
router12.patch("/:id/toggle", toggle);
var testimonial_routes_default2 = router12;

// src/routes/program.routes.ts
import { Router as Router13 } from "express";

// src/services/program.service.ts
async function getPublicPrograms({ categoryId }) {
  return prisma_default.program.findMany({
    where: {
      status: "active",
      ...categoryId ? { categoryId } : {}
    },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
}
async function getProgramById(id) {
  const program = await prisma_default.program.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!program) throw new Error("PROGRAM_NOT_FOUND");
  return program;
}

// src/controllers/program.controller.ts
async function index11(req, res) {
  try {
    const categoryId = getStringQuery(req, "categoryId");
    const programs = await getPublicPrograms({
      categoryId: categoryId ? parseInt(categoryId) : void 0
    });
    return res.json({ success: true, data: programs });
  } catch (error) {
    console.error("Get programs error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show8(req, res) {
  try {
    const id = parseInt(getStringParam(req, "id"));
    const program = await getProgramById(id);
    return res.json({ success: true, data: program });
  } catch (error) {
    if (error.message === "PROGRAM_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Program tidak ditemukan" });
    }
    console.error("Get program detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/program.routes.ts
var router13 = Router13();
router13.get("/", index11);
router13.get("/:id", show8);
var program_routes_default = router13;

// src/routes/admin/program.routes.ts
import { Router as Router14 } from "express";

// src/controllers/admin/program.controller.ts
import { matchedData as matchedData2 } from "express-validator";

// src/errors/program.errors.ts
var validationError = (field, message) => new AppError("VALIDATION_ERROR", 400, "Data yang dikirim tidak valid", [{ field, message }]);
var ProgramErrors = {
  notFound: () => new AppError("PROGRAM_NOT_FOUND", 404, "Program tidak ditemukan"),
  categoryNotFound: () => validationError("categoryId", "Kategori program tidak ditemukan"),
  invalidDateRange: () => validationError("endDate", "Tanggal selesai tidak boleh sebelum tanggal mulai"),
  capacityBelowParticipants: (current) => validationError("capacity", `Kuota tidak boleh kurang dari jumlah peserta saat ini (${current})`),
  hasRegistrations: () => new AppError(
    "PROGRAM_HAS_REGISTRATIONS",
    409,
    "Program tidak dapat dihapus karena sudah memiliki pendaftar. Ubah statusnya menjadi nonaktif."
  )
};

// src/services/user/registration.mapper.ts
var registrationResultInclude = {
  user: { select: { name: true, email: true, phone: true } },
  program: { select: { id: true, name: true, programFormat: true, installmentPlan: true } },
  payments: { select: { id: true, invoiceNumber: true, amount: true, status: true, notes: true } }
};
function toDateOnly(date) {
  return date ? date.toISOString().slice(0, 10) : null;
}
function toApplicant(registration) {
  const { user } = registration;
  return {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? null,
    nik: registration.nik,
    gender: registration.gender,
    birthPlace: registration.birthPlace,
    birthDate: toDateOnly(registration.birthDate),
    lastEducation: registration.lastEducation,
    major: registration.major,
    educationInstitution: registration.educationInstitution,
    currentActivity: registration.currentActivity,
    maritalStatus: registration.maritalStatus,
    parentRelationship: registration.parentRelationship,
    parentPhone: registration.parentPhone,
    ktp: {
      provinceCode: registration.ktpProvinceCode,
      provinceName: registration.ktpProvinceName,
      cityCode: registration.ktpCityCode,
      cityName: registration.ktpCityName,
      address: registration.ktpAddress
    },
    domicile: {
      provinceCode: registration.domicileProvinceCode,
      provinceName: registration.domicileProvinceName,
      cityCode: registration.domicileCityCode,
      cityName: registration.domicileCityName,
      address: registration.domicileAddress
    }
  };
}
function toDocuments(registration) {
  return {
    photoPath: registration.photoPath,
    n4CertificatePath: registration.n4CertificatePath,
    sswCertificatePath: registration.sswCertificatePath
  };
}
function toRegistrationResult(registration) {
  const { program, payments } = registration;
  const [payment] = payments;
  return {
    registrationId: registration.id,
    registrationCode: registration.registrationCode,
    registrationStatus: registration.registrationStatus,
    registrationDate: registration.registrationDate,
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null
    },
    payment: {
      id: payment.id,
      invoiceNumber: payment.invoiceNumber,
      amount: payment.amount.toString(),
      status: payment.status,
      notes: payment.notes,
      installmentPlan: program?.installmentPlan ?? null
    },
    applicant: toApplicant(registration),
    documents: toDocuments(registration)
  };
}

// src/services/admin/program.mapper.ts
var programListSelect = {
  id: true,
  name: true,
  programFormat: true,
  duration: true,
  capacity: true,
  currentParticipants: true,
  trainingCost: true,
  status: true,
  isRunning: true,
  sortOrder: true,
  category: { select: { id: true, name: true } },
  _count: { select: { registrations: true } }
};
var programDetailInclude = {
  category: { select: { id: true, name: true } },
  _count: { select: { registrations: true } }
};
function toProgramListItem(program) {
  const registrationCount = program._count.registrations;
  return {
    id: program.id,
    name: program.name,
    programFormat: program.programFormat,
    category: program.category,
    duration: program.duration,
    capacity: program.capacity,
    currentParticipants: program.currentParticipants,
    remainingSlots: program.capacity === null ? null : Math.max(0, program.capacity - program.currentParticipants),
    trainingCost: program.trainingCost.toString(),
    status: program.status,
    isRunning: program.isRunning,
    sortOrder: program.sortOrder,
    registrationCount,
    canDelete: registrationCount === 0
  };
}
function toProgramDetail(program) {
  return {
    ...toProgramListItem(program),
    categoryId: program.categoryId,
    description: program.description,
    requirements: program.requirements,
    schedule: program.schedule,
    contactInfo: program.contactInfo,
    registrationDeadline: toDateOnly(program.registrationDeadline),
    startDate: toDateOnly(program.startDate),
    endDate: toDateOnly(program.endDate),
    location: program.location,
    trainingFeeDetails: program.trainingFeeDetails,
    departureCost: program.departureCost.toString(),
    departureFeeDetails: program.departureFeeDetails,
    installmentPlan: program.installmentPlan,
    downPayment: program.downPayment.toString(),
    jobMatchingCost: program.jobMatchingCost.toString(),
    bridgeFund: program.bridgeFund,
    timelineText: program.timelineText,
    requirementsText: program.requirementsText,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt
  };
}

// src/services/admin/program.service.ts
var ORDER_BY = [{ sortOrder: "asc" }, { createdAt: "desc" }];
var NULLABLE_FIELDS = [
  "programFormat",
  "categoryId",
  "description",
  "requirements",
  "schedule",
  "duration",
  "capacity",
  "contactInfo",
  "registrationDeadline",
  "startDate",
  "endDate",
  "location",
  "trainingFeeDetails",
  "departureFeeDetails",
  "bridgeFund",
  "timelineText",
  "requirementsText"
];
function buildWhere({ search, categoryId, status, isRunning }) {
  return {
    ...categoryId ? { categoryId } : {},
    ...status ? { status } : {},
    ...isRunning !== void 0 ? { isRunning } : {},
    ...search ? { OR: [{ name: { contains: search } }, { programFormat: { contains: search } }] } : {}
  };
}
function normalizeInput(input) {
  const normalized = { ...input };
  for (const field of NULLABLE_FIELDS) {
    if (normalized[field] === "") normalized[field] = null;
  }
  return normalized;
}
async function findOrFail(id) {
  const program = await prisma_default.program.findUnique({ where: { id }, include: programDetailInclude });
  if (!program) throw ProgramErrors.notFound();
  return program;
}
async function assertCategoryExists(categoryId) {
  if (!categoryId) return;
  const exists = await prisma_default.programCategory.count({ where: { id: categoryId } });
  if (!exists) throw ProgramErrors.categoryNotFound();
}
function assertDateRange(startDate, endDate) {
  if (startDate && endDate && endDate < startDate) throw ProgramErrors.invalidDateRange();
}
function assertCapacity(capacity, currentParticipants) {
  if (capacity !== null && capacity !== void 0 && capacity < currentParticipants) {
    throw ProgramErrors.capacityBelowParticipants(currentParticipants);
  }
}
async function getSummary() {
  const [byStatus, capacity] = await Promise.all([
    prisma_default.program.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma_default.program.aggregate({ _sum: { capacity: true } })
  ]);
  const countOf = (status) => byStatus.find((row) => row.status === status)?._count._all ?? 0;
  return {
    total: byStatus.reduce((sum, row) => sum + row._count._all, 0),
    active: countOf("active"),
    inactive: countOf("inactive"),
    full: countOf("full"),
    totalCapacity: capacity._sum.capacity ?? 0
  };
}
async function getOptions() {
  const [categories, formats] = await Promise.all([
    prisma_default.programCategory.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma_default.program.findMany({
      where: { programFormat: { not: null } },
      select: { programFormat: true },
      distinct: ["programFormat"],
      orderBy: { programFormat: "asc" }
    })
  ]);
  return {
    categories,
    programFormats: formats.map((row) => row.programFormat),
    statuses: Object.values(ProgramStatus)
  };
}
async function listPrograms(filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildWhere(filters2);
  const [total, programs] = await Promise.all([
    prisma_default.program.count({ where }),
    prisma_default.program.findMany({ where, select: programListSelect, orderBy: ORDER_BY, skip, take })
  ]);
  return { items: programs.map(toProgramListItem), meta: buildPaginationMeta(total, page, limit) };
}
async function getProgramById2(id) {
  return toProgramDetail(await findOrFail(id));
}
async function createProgram(input) {
  const data = normalizeInput(input);
  await assertCategoryExists(data.categoryId);
  assertDateRange(data.startDate, data.endDate);
  const program = await prisma_default.program.create({
    data,
    include: programDetailInclude
  });
  return toProgramDetail(program);
}
async function updateProgram(id, input) {
  const existing = await findOrFail(id);
  const data = normalizeInput(input);
  await assertCategoryExists(data.categoryId);
  assertDateRange(
    data.startDate !== void 0 ? data.startDate : existing.startDate,
    data.endDate !== void 0 ? data.endDate : existing.endDate
  );
  assertCapacity(data.capacity, existing.currentParticipants);
  const program = await prisma_default.program.update({
    where: { id },
    data,
    include: programDetailInclude
  });
  return toProgramDetail(program);
}
async function deleteProgram(id) {
  const existing = await findOrFail(id);
  if (existing._count.registrations > 0) throw ProgramErrors.hasRegistrations();
  await prisma_default.program.delete({ where: { id } });
}

// src/controllers/admin/program.controller.ts
async function summary(_req, res) {
  const data = await getSummary();
  return res.json({ success: true, data });
}
async function options(_req, res) {
  const data = await getOptions();
  return res.json({ success: true, data });
}
async function index12(req, res) {
  const { items, meta } = await listPrograms(matchedData2(req));
  return res.json({ success: true, data: items, meta });
}
async function show9(req, res) {
  const { id } = matchedData2(req);
  const data = await getProgramById2(id);
  return res.json({ success: true, data });
}
async function store6(req, res) {
  const data = await createProgram(matchedData2(req));
  return res.status(201).json({ success: true, message: "Program berhasil dibuat", data });
}
async function update6(req, res) {
  const { id, ...input } = matchedData2(req);
  const data = await updateProgram(id, input);
  return res.json({ success: true, message: "Program berhasil diperbarui", data });
}
async function destroy6(req, res) {
  const { id } = matchedData2(req);
  await deleteProgram(id);
  return res.json({ success: true, message: "Program berhasil dihapus" });
}

// src/validators/program.validator.ts
import { body as body3, query as query2 } from "express-validator";

// src/config/program.config.ts
var PROGRAM_LIMITS = {
  short: 191,
  long: 2e4,
  capacity: 1e5,
  sortOrder: 9999,
  money: 9999999999e-2
};
var INSTALLMENT_PLAN_PATTERN = /^(none|\d{1,2}_installments)$/;

// src/validators/common.validator.ts
import { param, query } from "express-validator";
var idParamRule = param("id").isInt({ min: 1 }).withMessage("ID tidak valid").toInt();
var paginationRules = [
  query("page").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Page harus berupa angka minimal 1").toInt(),
  query("limit").optional({ values: "falsy" }).isInt({ min: 1, max: MAX_PAGE_SIZE }).withMessage(`Limit harus berupa angka 1 sampai ${MAX_PAGE_SIZE}`).toInt()
];
var searchRule = query("search").optional({ values: "falsy" }).trim().isLength({ max: SEARCH_MAX_LENGTH }).withMessage(`Kata kunci maksimal ${SEARCH_MAX_LENGTH} karakter`);
function enumQueryRule(field, label, values) {
  return query(field).optional({ values: "falsy" }).isIn(values).withMessage(`${label} harus salah satu dari: ${values.join(", ")}`);
}

// src/validators/rule-factories.ts
import { body as body2 } from "express-validator";
var isFilled = (value) => value !== null && value !== "";
function startRule(field, { label, optional = false, nullable = false }) {
  const chain = body2(field);
  if (nullable) return chain.optional({ values: "undefined" }).if(isFilled);
  if (optional) return chain.optional();
  return chain.exists().withMessage(`${label} wajib diisi`).bail();
}
function textRule(field, options4) {
  const { label, max, nullable = false } = options4;
  const text = startRule(field, options4).isString().withMessage(`${label} harus berupa teks`).bail().trim();
  const filled = nullable ? text : text.notEmpty().withMessage(`${label} tidak boleh kosong`).bail();
  return filled.isLength({ max }).withMessage(`${label} maksimal ${max} karakter`);
}
function intRule(field, options4) {
  const { label, min, max } = options4;
  const message = max === void 0 ? `${label} harus berupa angka minimal ${min}` : `${label} harus berupa angka ${min} sampai ${max}`;
  return startRule(field, options4).isInt(max === void 0 ? { min } : { min, max }).withMessage(message).toInt();
}
function decimalRule(field, options4) {
  const { label, min, max } = options4;
  return startRule(field, options4).isFloat({ min, max }).withMessage(`${label} harus berupa angka ${min} sampai ${max}`).toFloat();
}
function dateRule(field, options4) {
  return startRule(field, options4).isISO8601({ strict: true, strictSeparator: true }).withMessage(`${options4.label} harus berformat YYYY-MM-DD`).toDate();
}
function enumRule(field, values, options4) {
  return startRule(field, options4).isIn(values).withMessage(`${options4.label} harus salah satu dari: ${values.join(", ")}`);
}
function booleanRule(chain, label) {
  return chain.optional({ values: "null" }).isBoolean().withMessage(`${label} harus true atau false`).toBoolean();
}

// src/validators/program.validator.ts
var STATUS_VALUES = Object.values(ProgramStatus);
var SHORT_TEXT_FIELDS = {
  programFormat: "Format program",
  duration: "Durasi",
  location: "Lokasi",
  bridgeFund: "Dana talangan"
};
var LONG_TEXT_FIELDS = {
  description: "Deskripsi",
  requirements: "Persyaratan",
  schedule: "Jadwal",
  contactInfo: "Informasi kontak",
  trainingFeeDetails: "Rincian biaya pelatihan",
  departureFeeDetails: "Rincian biaya keberangkatan",
  timelineText: "Timeline",
  requirementsText: "Syarat pendaftaran"
};
var MONEY_FIELDS = {
  trainingCost: "Biaya pelatihan",
  departureCost: "Biaya keberangkatan",
  downPayment: "Uang muka",
  jobMatchingCost: "Biaya job matching"
};
var DATE_FIELDS = {
  registrationDeadline: "Batas pendaftaran",
  startDate: "Tanggal mulai",
  endDate: "Tanggal selesai"
};
function programFieldRules(partial) {
  return [
    textRule("name", { label: "Nama program", max: PROGRAM_LIMITS.short, optional: partial }),
    ...Object.entries(SHORT_TEXT_FIELDS).map(
      ([field, label]) => textRule(field, { label, max: PROGRAM_LIMITS.short, nullable: true })
    ),
    ...Object.entries(LONG_TEXT_FIELDS).map(
      ([field, label]) => textRule(field, { label, max: PROGRAM_LIMITS.long, nullable: true })
    ),
    ...Object.entries(MONEY_FIELDS).map(
      ([field, label]) => decimalRule(field, { label, min: 0, max: PROGRAM_LIMITS.money, optional: true })
    ),
    ...Object.entries(DATE_FIELDS).map(([field, label]) => dateRule(field, { label, nullable: true })),
    intRule("categoryId", { label: "Kategori", min: 1, nullable: true }),
    intRule("capacity", { label: "Kuota", min: 1, max: PROGRAM_LIMITS.capacity, nullable: true }),
    intRule("sortOrder", { label: "Urutan", min: 0, max: PROGRAM_LIMITS.sortOrder, optional: true }),
    enumRule("status", STATUS_VALUES, { label: "Status", optional: true }),
    booleanRule(body3("isRunning"), "isRunning"),
    body3("installmentPlan").optional().matches(INSTALLMENT_PLAN_PATTERN).withMessage("Skema cicilan tidak valid (contoh: none, 3_installments)")
  ];
}
var listProgramsRules = [
  ...paginationRules,
  searchRule,
  query2("categoryId").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Kategori tidak valid").toInt(),
  enumQueryRule("status", "Status", STATUS_VALUES),
  booleanRule(query2("isRunning"), "isRunning")
];
var programIdRules = [idParamRule];
var createProgramRules = programFieldRules(false);
var updateProgramRules = [idParamRule, ...programFieldRules(true)];

// src/routes/admin/program.routes.ts
var router14 = Router14();
router14.use(...superAdminAccess);
router14.get("/summary", summary);
router14.get("/options", options);
router14.get("/", validate(listProgramsRules), index12);
router14.post("/", validate(createProgramRules), store6);
router14.get("/:id", validate(programIdRules), show9);
router14.put("/:id", validate(updateProgramRules), update6);
router14.delete("/:id", validate(programIdRules), destroy6);
var program_routes_default2 = router14;

// src/routes/teamMember.routes.ts
import { Router as Router15 } from "express";

// src/services/teamMember.service.ts
function findPublicMembers(type) {
  return prisma_default.teamMember.findMany({
    where: { isActive: true, type },
    select: { id: true, name: true, position: true, bio: true, image: true },
    orderBy: [{ order: "asc" }, { id: "asc" }]
  });
}
function getPublicExperts() {
  return findPublicMembers("expert");
}
function getPublicTeamMembers() {
  return findPublicMembers("team");
}

// src/controllers/teamMember.controller.ts
async function index13(_req, res) {
  try {
    const teamMembers = await getPublicTeamMembers();
    return res.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error("Get team members error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function experts(_req, res) {
  try {
    const data = await getPublicExperts();
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Get experts error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/teamMember.routes.ts
var router15 = Router15();
router15.get("/", index13);
router15.get("/experts", experts);
var teamMember_routes_default = router15;

// src/routes/admin/teamMember.routes.ts
import { Router as Router16 } from "express";

// src/controllers/admin/teamMember.controller.ts
import { matchedData as matchedData3 } from "express-validator";

// src/errors/teamMember.errors.ts
var TeamMemberErrors = {
  notFound: () => new AppError("TEAM_MEMBER_NOT_FOUND", 404, "Anggota tim tidak ditemukan"),
  someNotFound: () => new AppError("TEAM_MEMBER_NOT_FOUND", 404, "Sebagian anggota tim yang diurutkan tidak ditemukan"),
  imageRequired: () => new AppError("IMAGE_REQUIRED", 400, "File gambar wajib diunggah (field: image)"),
  nothingToUpdate: () => new AppError("NOTHING_TO_UPDATE", 400, "Tidak ada data yang dikirim untuk diperbarui")
};

// src/services/admin/teamMember.service.ts
var ORDER_BY2 = [{ order: "asc" }, { id: "asc" }];
function toMemberItem(member) {
  return {
    id: member.id,
    type: member.type,
    name: member.name,
    position: member.position,
    bio: member.bio,
    image: member.image,
    order: member.order,
    isActive: member.isActive,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt
  };
}
function buildWhere2(type, { search, isActive }) {
  return {
    type,
    ...isActive !== void 0 ? { isActive } : {},
    ...search ? { OR: [{ name: { contains: search } }, { position: { contains: search } }] } : {}
  };
}
function emptyToNull(value) {
  return value === void 0 ? void 0 : value || null;
}
async function findOrFail2(type, id) {
  const member = await prisma_default.teamMember.findFirst({ where: { id, type } });
  if (!member) throw TeamMemberErrors.notFound();
  return member;
}
async function nextOrder(type) {
  const { _max } = await prisma_default.teamMember.aggregate({ where: { type }, _max: { order: true } });
  return (_max.order ?? 0) + 1;
}
async function getSummary2(type) {
  const [total, active] = await Promise.all([
    prisma_default.teamMember.count({ where: { type } }),
    prisma_default.teamMember.count({ where: { type, isActive: true } })
  ]);
  return { total, active, inactive: total - active };
}
async function listMembers(type, filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildWhere2(type, filters2);
  const [members2, total, summary9] = await Promise.all([
    prisma_default.teamMember.findMany({ where, orderBy: ORDER_BY2, skip, take }),
    prisma_default.teamMember.count({ where }),
    getSummary2(type)
  ]);
  return { items: members2.map(toMemberItem), meta: buildPaginationMeta(total, page, limit), summary: summary9 };
}
async function getMemberById(type, id) {
  return toMemberItem(await findOrFail2(type, id));
}
async function createMember(type, input, file) {
  const image = toUploadedPath(TEAM_MEMBER_UPLOAD_FOLDER, file);
  return withUploadCleanup(image, async () => {
    const member = await prisma_default.teamMember.create({
      data: {
        type,
        name: input.name,
        position: input.position,
        bio: emptyToNull(input.bio),
        image,
        order: input.order ?? await nextOrder(type),
        isActive: input.isActive
      }
    });
    return toMemberItem(member);
  });
}
async function updateMember(type, id, input, file) {
  const newImage = toUploadedPath(TEAM_MEMBER_UPLOAD_FOLDER, file);
  const replacesImage = newImage !== void 0 || input.removeImage === true;
  return withUploadCleanup(newImage, async () => {
    const existing = await findOrFail2(type, id);
    const member = await prisma_default.teamMember.update({
      where: { id },
      data: {
        name: input.name,
        position: input.position,
        bio: emptyToNull(input.bio),
        order: input.order,
        isActive: input.isActive,
        image: replacesImage ? newImage ?? null : void 0
      }
    });
    if (replacesImage) await removePublicUpload(existing.image);
    return toMemberItem(member);
  });
}
async function deleteMember(type, id) {
  const existing = await findOrFail2(type, id);
  await prisma_default.teamMember.delete({ where: { id } });
  await removePublicUpload(existing.image);
}
async function reorderMembers(type, ids) {
  const found = await prisma_default.teamMember.count({ where: { id: { in: ids }, type } });
  if (found !== ids.length) throw TeamMemberErrors.someNotFound();
  await prisma_default.$transaction(
    ids.map((id, index22) => prisma_default.teamMember.update({ where: { id }, data: { order: index22 + 1 } }))
  );
  const members2 = await prisma_default.teamMember.findMany({ where: { type }, orderBy: ORDER_BY2 });
  return members2.map(toMemberItem);
}

// src/controllers/admin/teamMember.controller.ts
function createMemberHandlers(type, label) {
  return {
    async list(req, res) {
      const { items, meta, summary: summary9 } = await listMembers(type, matchedData3(req));
      return res.json({ success: true, data: items, meta, summary: summary9 });
    },
    async show(req, res) {
      const { id } = matchedData3(req);
      const data = await getMemberById(type, id);
      return res.json({ success: true, data });
    },
    async store(req, res) {
      const data = await createMember(type, matchedData3(req), req.file);
      return res.status(201).json({ success: true, message: `${label} berhasil dibuat`, data });
    },
    async update(req, res) {
      const { id, ...input } = matchedData3(req);
      const data = await updateMember(type, id, input, req.file);
      return res.json({ success: true, message: `${label} berhasil diperbarui`, data });
    },
    async destroy(req, res) {
      const { id } = matchedData3(req);
      await deleteMember(type, id);
      return res.json({ success: true, message: `${label} berhasil dihapus` });
    },
    async reorder(req, res) {
      const { ids } = matchedData3(req);
      const data = await reorderMembers(type, ids);
      return res.json({ success: true, message: `Urutan ${label.toLowerCase()} berhasil diperbarui`, data });
    }
  };
}
var experts2 = createMemberHandlers("expert", "Expert");
var members = createMemberHandlers("team", "Team Member");

// src/validators/teamMember.validator.ts
import { body as body4, query as query3 } from "express-validator";
var expertFieldRules = (optional) => [
  textRule("name", { label: "Nama", max: EXPERT_LIMITS.name, optional }),
  textRule("position", { label: "Posisi", max: EXPERT_LIMITS.position, optional }),
  textRule("bio", { label: "Bio", max: EXPERT_LIMITS.bio, nullable: true }),
  intRule("order", { label: "Urutan", min: 0, max: EXPERT_LIMITS.order, optional: true }),
  booleanRule(body4("isActive"), "isActive")
];
var listExpertsRules = [
  ...paginationRules,
  searchRule,
  booleanRule(query3("isActive"), "isActive")
];
var expertIdRules = [idParamRule];
var createExpertRules = expertFieldRules(false);
var updateExpertRules = [
  idParamRule,
  ...expertFieldRules(true),
  booleanRule(body4("removeImage"), "removeImage")
];
var reorderExpertsRules = [
  body4("ids").isArray({ min: 1, max: EXPERT_LIMITS.reorderItems }).withMessage(`ids harus berupa array berisi 1 sampai ${EXPERT_LIMITS.reorderItems} ID`).bail().custom((ids) => new Set(ids.map(String)).size === ids.length).withMessage("ids tidak boleh berisi ID yang sama"),
  body4("ids.*").isInt({ min: 1 }).withMessage("ID tidak valid").toInt()
];

// src/routes/admin/teamMember.routes.ts
var router16 = Router16();
router16.use(...cmsAccess);
function memberRouter(handlers) {
  const members2 = Router16();
  members2.get("/", validate(listExpertsRules), handlers.list);
  members2.post("/", uploadTeamMemberImage.single("image"), validate(createExpertRules), handlers.store);
  members2.patch("/reorder", validate(reorderExpertsRules), handlers.reorder);
  members2.get("/:id", validate(expertIdRules), handlers.show);
  members2.put("/:id", uploadTeamMemberImage.single("image"), validate(updateExpertRules), handlers.update);
  members2.delete("/:id", validate(expertIdRules), handlers.destroy);
  return members2;
}
router16.get("/", validate(listExpertsRules), experts2.list);
router16.use("/experts", memberRouter(experts2));
router16.use("/members", memberRouter(members));
var teamMember_routes_default2 = router16;

// src/routes/user/dashboard.routes.ts
import { Router as Router17 } from "express";

// src/services/user/dashboard.service.ts
async function getDashboardSummary(userId) {
  const [user, latestRegistration, unreadNotifications] = await Promise.all([
    prisma_default.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    }),
    prisma_default.registration.findFirst({
      where: { userId },
      orderBy: { registrationDate: "desc" },
      include: {
        program: {
          select: { id: true, name: true, programFormat: true, location: true }
        },
        selectionStatuses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true, notes: true, evaluatedAt: true }
        },
        placementStatuses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true, companyName: true, placementDate: true }
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            amount: true,
            amountPaid: true,
            dueDate: true,
            notes: true
          }
        }
      }
    }),
    prisma_default.notification.count({ where: { userId, isRead: false } })
  ]);
  const selectionStatus = latestRegistration?.selectionStatuses?.[0] ?? null;
  const placementStatus = latestRegistration?.placementStatuses?.[0] ?? null;
  const latestPayment = latestRegistration?.payments?.[0] ?? null;
  return {
    program: latestRegistration?.program ?? null,
    registrationStatus: latestRegistration?.registrationStatus ?? null,
    registrationCode: latestRegistration?.registrationCode ?? null,
    selectionStatus: selectionStatus ? {
      status: selectionStatus.status,
      notes: selectionStatus.notes,
      evaluatedAt: selectionStatus.evaluatedAt
    } : null,
    placementStatus: placementStatus ? {
      status: placementStatus.status,
      companyName: placementStatus.companyName,
      placementDate: placementStatus.placementDate
    } : null,
    payment: latestPayment ? {
      id: latestPayment.id,
      invoiceNumber: latestPayment.invoiceNumber,
      status: latestPayment.status,
      amount: latestPayment.amount,
      amountPaid: latestPayment.amountPaid,
      dueDate: latestPayment.dueDate,
      notes: latestPayment.notes
    } : null,
    unreadNotifications,
    hasRegistration: latestRegistration !== null
  };
}

// src/controllers/user/dashboard.controller.ts
async function show10(req, res) {
  try {
    const summary9 = await getDashboardSummary(req.user.userId);
    return res.json({ success: true, data: summary9 });
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/user/dashboard.routes.ts
var router17 = Router17();
router17.use(authenticate);
router17.get("/", show10);
var dashboard_routes_default = router17;

// src/routes/user/profile.routes.ts
import { Router as Router18 } from "express";

// src/services/user/profile.service.ts
async function getProfile(userId) {
  const user = await prisma_default.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      birthPlace: true,
      birthDate: true,
      role: true,
      createdAt: true
    }
  });
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}
async function updateProfile(userId, data) {
  return prisma_default.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      birthPlace: data.birthPlace,
      birthDate: data.birthDate ? new Date(data.birthDate) : void 0
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      birthPlace: true,
      birthDate: true,
      role: true
    }
  });
}

// src/controllers/user/profile.controller.ts
async function show11(req, res) {
  try {
    const profile = await getProfile(req.user.userId);
    return res.json({ success: true, data: profile });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan" });
    }
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function update7(req, res) {
  try {
    const { name, phone, address, birthPlace, birthDate } = req.body || {};
    const profile = await updateProfile(req.user.userId, {
      name,
      phone,
      address,
      birthPlace,
      birthDate
    });
    return res.json({ success: true, message: "Profil berhasil diperbarui", data: profile });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/user/profile.routes.ts
var router18 = Router18();
router18.use(authenticate);
router18.get("/", show11);
router18.put("/", update7);
var profile_routes_default = router18;

// src/routes/user/registration.routes.ts
import { Router as Router19 } from "express";

// src/controllers/user/registration.controller.ts
import { matchedData as matchedData4 } from "express-validator";

// src/errors/registration.errors.ts
var RegistrationErrors = {
  userNotFound: () => new AppError("USER_NOT_FOUND", 404, "Pengguna tidak ditemukan"),
  programNotFound: () => new AppError("PROGRAM_NOT_FOUND", 404, "Program tidak ditemukan atau tidak aktif"),
  programNotActive: () => new AppError("PROGRAM_NOT_ACTIVE", 400, "Program ini sedang tidak membuka pendaftaran"),
  programFull: () => new AppError("PROGRAM_FULL", 409, "Kuota program sudah penuh"),
  deadlinePassed: () => new AppError("REGISTRATION_DEADLINE_PASSED", 400, "Pendaftaran program ini sudah ditutup"),
  alreadyRegistered: () => new AppError("ALREADY_REGISTERED", 409, "Anda sudah terdaftar di program ini"),
  missingFiles: (labels) => new AppError("MISSING_FILES", 400, `Dokumen wajib diunggah: ${labels.join(", ")}`),
  codeGenerationFailed: () => new AppError("CODE_GENERATION_FAILED", 500, "Gagal membuat nomor pendaftaran, silakan coba lagi")
};

// src/services/user/registration-files.ts
function mapUploadedFiles(files) {
  const byField = files ?? {};
  const paths = {};
  for (const { field, column } of REGISTRATION_FILES) {
    const file = byField[field]?.[0];
    if (file) paths[column] = toPublicUploadPath(REGISTRATION_UPLOAD_FOLDER, file.filename);
  }
  return paths;
}
function assertRequiredFiles(paths) {
  const missing = REGISTRATION_FILES.filter((file) => file.required && !paths[file.column]).map((file) => file.label);
  if (missing.length > 0) throw RegistrationErrors.missingFiles(missing);
}

// src/utils/code-generator.ts
function periodKey(format, date) {
  const local = new Date(date.getTime() + REGISTRATION_TIMEZONE_OFFSET_HOURS * 36e5);
  const year = String(local.getUTCFullYear());
  const month = String(local.getUTCMonth() + 1).padStart(2, "0");
  return format.scope === "year" ? year : `${year}${month}`;
}
async function nextSequentialCode(format, date, findLatest) {
  const prefix = `${format.prefix}-${periodKey(format, date)}-`;
  const latest = await findLatest(prefix);
  const lastSequence = latest ? parseInt(latest.slice(prefix.length), 10) : 0;
  const next = (Number.isNaN(lastSequence) ? 0 : lastSequence) + 1;
  return `${prefix}${String(next).padStart(format.pad, "0")}`;
}
function nextRegistrationCode(db, date = /* @__PURE__ */ new Date()) {
  return nextSequentialCode(REGISTRATION_CODE_FORMAT, date, async (prefix) => {
    const latest = await db.registration.findFirst({
      where: { registrationCode: { startsWith: prefix } },
      orderBy: { registrationCode: "desc" },
      select: { registrationCode: true }
    });
    return latest?.registrationCode ?? null;
  });
}
function nextInvoiceNumber(db, date = /* @__PURE__ */ new Date()) {
  return nextSequentialCode(INVOICE_CODE_FORMAT, date, async (prefix) => {
    const latest = await db.payment.findFirst({
      where: { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true }
    });
    return latest?.invoiceNumber ?? null;
  });
}
function nextReceiptNumber(db, date = /* @__PURE__ */ new Date()) {
  return nextSequentialCode(RECEIPT_CODE_FORMAT, date, async (prefix) => {
    const latest = await db.payment.findFirst({
      where: { receiptNumber: { startsWith: prefix } },
      orderBy: { receiptNumber: "desc" },
      select: { receiptNumber: true }
    });
    return latest?.receiptNumber ?? null;
  });
}

// src/utils/prisma-error.ts
function hasCode(error, code) {
  return error instanceof prismaNamespace_exports.PrismaClientKnownRequestError && error.code === code;
}
var isUniqueViolation = (error) => hasCode(error, "P2002");
var isForeignKeyViolation = (error) => hasCode(error, "P2003");

// src/utils/date.ts
var MS_PER_HOUR = 36e5;
function endOfDeadlineDay(deadline) {
  return new Date(deadline.getTime() + (24 - REGISTRATION_TIMEZONE_OFFSET_HOURS) * MS_PER_HOUR - 1);
}

// src/services/user/registration-policy.ts
function assertProgramAcceptsRegistration(program, now = /* @__PURE__ */ new Date()) {
  if (program.status === "full") throw RegistrationErrors.programFull();
  if (program.status !== "active") throw RegistrationErrors.programNotActive();
  if (program.registrationDeadline && now > endOfDeadlineDay(program.registrationDeadline)) {
    throw RegistrationErrors.deadlinePassed();
  }
  if (program.capacity !== null && program.currentParticipants >= program.capacity) {
    throw RegistrationErrors.programFull();
  }
}

// src/utils/format.ts
var rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});
var dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta"
});
var ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
var JAKARTA_OFFSET_MS = 7 * 36e5;
function formatRupiah(value) {
  return rupiahFormatter.format(Number(value));
}
function formatDate(value) {
  if (!value) return "-";
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}
function getRomanMonthYear(date) {
  const local = new Date(date.getTime() + JAKARTA_OFFSET_MS);
  return { roman: ROMAN_MONTHS[local.getUTCMonth()], year: local.getUTCFullYear() };
}

// src/services/admin/payment.notifications.ts
function buildInvoiceIssuedNotification({ invoiceNumber, amount, dueDate }) {
  const due = dueDate ? `, jatuh tempo ${formatDate(dueDate)}` : "";
  return {
    title: "Tagihan baru",
    message: `Tagihan ${invoiceNumber} sebesar ${formatRupiah(amount)} telah diterbitkan${due}.`,
    type: "info"
  };
}
function buildPaymentVerifiedNotification(invoiceNumber, { settled, installmentPaid }) {
  const title = "Pembayaran diverifikasi";
  if (settled) {
    return { title, message: `Pembayaran tagihan ${invoiceNumber} telah diverifikasi dan dinyatakan lunas.`, type: "success" };
  }
  return {
    title,
    message: `Pembayaran cicilan ke-${installmentPaid} untuk tagihan ${invoiceNumber} telah diverifikasi.`,
    type: "success"
  };
}
async function createPaymentNotification(tx, userId, paymentId, draft) {
  if (!userId) return;
  await tx.notification.create({
    data: { userId, relatedEntity: "payment", relatedEntityId: paymentId, ...draft }
  });
}

// src/services/user/registration.service.ts
var ISSUED_ONLY = {
  issuedAt: { not: null }
};
async function getMyRegistrations(userId) {
  return prisma_default.registration.findMany({
    where: { userId },
    include: {
      program: true,
      selectionStatuses: { orderBy: { createdAt: "desc" }, take: 1 },
      placementStatuses: { orderBy: { createdAt: "desc" }, take: 1 },
      payments: { where: ISSUED_ONLY }
    },
    orderBy: { registrationDate: "desc" }
  });
}
async function getMyRegistrationById(userId, id) {
  const registration = await prisma_default.registration.findFirst({
    where: { id, userId },
    include: {
      program: true,
      statusHistory: { orderBy: { changedAt: "desc" } },
      selectionStatuses: { orderBy: { createdAt: "desc" } },
      placementStatuses: { orderBy: { createdAt: "desc" } },
      payments: {
        where: ISSUED_ONLY,
        include: { paymentHistory: { orderBy: { changedAt: "desc" } } }
      }
    }
  });
  if (!registration) throw new Error("REGISTRATION_NOT_FOUND");
  return registration;
}
async function reserveSlot(tx, program) {
  const result = await tx.program.updateMany({
    where: {
      id: program.id,
      ...program.capacity !== null ? { currentParticipants: { lt: program.capacity } } : {}
    },
    data: { currentParticipants: { increment: 1 } }
  });
  if (result.count === 0) throw RegistrationErrors.programFull();
}
async function registerInTransaction(tx, userId, input, filePaths) {
  const { programId, birthDate, fullName, phone, ...profile } = input;
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  if (!user) throw RegistrationErrors.userNotFound();
  const program = await tx.program.findUnique({ where: { id: programId } });
  if (!program) throw RegistrationErrors.programNotFound();
  assertProgramAcceptsRegistration(program);
  const existing = await tx.registration.findUnique({
    where: { unique_user_program: { userId, programId } },
    select: { id: true }
  });
  if (existing) throw RegistrationErrors.alreadyRegistered();
  await reserveSlot(tx, program);
  const registrationCode = await nextRegistrationCode(tx);
  const invoiceNumber = await nextInvoiceNumber(tx);
  if (fullName || phone) {
    await tx.user.update({
      where: { id: userId },
      data: {
        ...fullName ? { name: fullName } : {},
        ...phone ? { phone } : {}
      }
    });
  }
  const dueDate = program.registrationDeadline ?? null;
  const registrationFeeNotes = REGISTRATION_FEE.defaultNotes(program.name);
  const now = /* @__PURE__ */ new Date();
  const registration = await tx.registration.create({
    data: {
      userId,
      programId,
      registrationCode,
      birthDate: new Date(birthDate),
      ...profile,
      ...filePaths,
      payments: {
        create: {
          invoiceNumber,
          amount: REGISTRATION_FEE.amount,
          status: "pending",
          currentInstallmentNumber: 0,
          issuedAt: now,
          dueDate,
          nextDueDate: dueDate,
          notes: registrationFeeNotes
        }
      },
      selectionStatuses: { create: {} },
      placementStatuses: { create: {} }
    },
    include: registrationResultInclude
  });
  const createdPayment = registration.payments[0];
  if (createdPayment) {
    await createPaymentNotification(
      tx,
      userId,
      createdPayment.id,
      buildInvoiceIssuedNotification({
        invoiceNumber,
        amount: new prismaNamespace_exports.Decimal(REGISTRATION_FEE.amount),
        dueDate
      })
    );
  }
  return toRegistrationResult(registration);
}
async function createRegistration(userId, input, filePaths) {
  assertRequiredFiles(filePaths);
  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma_default.$transaction(
        (tx) => registerInTransaction(tx, userId, input, filePaths)
      );
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      const duplicate = await prisma_default.registration.findUnique({
        where: { unique_user_program: { userId, programId: input.programId } },
        select: { id: true }
      });
      if (duplicate) throw RegistrationErrors.alreadyRegistered();
      if (attempt >= MAX_CODE_COLLISION_RETRIES)
        throw RegistrationErrors.codeGenerationFailed();
    }
  }
}

// src/controllers/user/registration.controller.ts
async function index14(req, res) {
  try {
    const registrations2 = await getMyRegistrations(req.user.userId);
    return res.json({ success: true, data: registrations2 });
  } catch (error) {
    console.error("Get my registrations error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function show12(req, res) {
  try {
    const id = parseInt(req.params.id);
    const registration = await getMyRegistrationById(req.user.userId, id);
    return res.json({ success: true, data: registration });
  } catch (error) {
    if (error.message === "REGISTRATION_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Pendaftaran tidak ditemukan" });
    }
    console.error("Get my registration detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function store7(req, res) {
  const uploadedFiles = collectUploadedFiles(req);
  try {
    const input = matchedData4(req);
    const result = await createRegistration(
      req.user.userId,
      input,
      mapUploadedFiles(req.files)
    );
    return res.status(201).json({ success: true, message: "Pendaftaran berhasil", data: result });
  } catch (error) {
    await removeFiles(uploadedFiles);
    throw error;
  }
}

// src/validators/registration.validator.ts
import { body as body5 } from "express-validator";
var TEXT_FIELDS = [
  { field: "birthPlace", label: "Tempat lahir", required: true },
  { field: "lastEducation", label: "Pendidikan terakhir", required: true },
  { field: "major", label: "Jurusan" },
  { field: "educationInstitution", label: "Institusi pendidikan" },
  { field: "currentActivity", label: "Kegiatan saat ini" },
  { field: "maritalStatus", label: "Status pernikahan", max: 50 },
  { field: "parentRelationship", label: "Hubungan dengan orang tua/wali", max: 50 },
  { field: "ktpProvinceCode", label: "Kode provinsi KTP", required: true, max: 20 },
  { field: "ktpProvinceName", label: "Provinsi KTP", required: true },
  { field: "ktpCityCode", label: "Kode kota KTP", required: true, max: 20 },
  { field: "ktpCityName", label: "Kota KTP", required: true },
  { field: "ktpAddress", label: "Alamat KTP", required: true, max: 1e3 },
  { field: "domicileProvinceCode", label: "Kode provinsi domisili", max: 20 },
  { field: "domicileProvinceName", label: "Provinsi domisili" },
  { field: "domicileCityCode", label: "Kode kota domisili", max: 20 },
  { field: "domicileCityName", label: "Kota domisili" },
  { field: "domicileAddress", label: "Alamat domisili", max: 1e3 },
  { field: "fullName", label: "Nama lengkap" }
];
function baseChain(field, label, required) {
  return required ? body5(field).trim().notEmpty().withMessage(`${label} wajib diisi`).bail() : body5(field).optional({ values: "falsy" }).trim();
}
function textRule2({ field, label, required = false, max = 255 }) {
  return baseChain(field, label, required).isLength({ max }).withMessage(`${label} maksimal ${max} karakter`);
}
function phoneRule(field, label, required) {
  return baseChain(field, label, required).matches(PHONE_PATTERN).withMessage(`${label} tidak valid (contoh: 081234567890)`);
}
var GENDER_VALUES = Object.values(Gender);
var createRegistrationRules = [
  body5("programId").notEmpty().withMessage("Program wajib dipilih").bail().isInt({ min: 1 }).withMessage("Program tidak valid").toInt(),
  body5("nik").trim().notEmpty().withMessage("NIK wajib diisi").bail().matches(NIK_PATTERN).withMessage("NIK harus 16 digit angka"),
  body5("gender").notEmpty().withMessage("Jenis kelamin wajib diisi").bail().isIn(GENDER_VALUES).withMessage(`Jenis kelamin harus salah satu dari: ${GENDER_VALUES.join(", ")}`),
  body5("birthDate").trim().notEmpty().withMessage("Tanggal lahir wajib diisi").bail().isISO8601({ strict: true, strictSeparator: true }).withMessage("Tanggal lahir harus berformat YYYY-MM-DD").bail().custom((value) => new Date(value) < /* @__PURE__ */ new Date()).withMessage("Tanggal lahir tidak boleh di masa depan"),
  phoneRule("parentPhone", "Nomor telepon orang tua/wali", true),
  phoneRule("phone", "Nomor telepon", false),
  ...TEXT_FIELDS.map(textRule2)
];

// src/routes/user/registration.routes.ts
var router19 = Router19();
router19.use(authenticate);
router19.get("/", index14);
router19.get("/:id", show12);
router19.post("/", uploadRegistrationFiles, validate(createRegistrationRules), store7);
var registration_routes_default = router19;

// src/routes/admin/payment.routes.ts
import { Router as Router20 } from "express";

// src/controllers/admin/payment.controller.ts
import { matchedData as matchedData5 } from "express-validator";

// src/errors/payment.errors.ts
var PaymentErrors = {
  notFound: () => new AppError("PAYMENT_NOT_FOUND", 404, "Tagihan tidak ditemukan"),
  registrationNotFound: () => new AppError("REGISTRATION_NOT_FOUND", 404, "Data pendaftaran tidak ditemukan"),
  installmentMismatch: () => new AppError("INSTALLMENT_MISMATCH", 400, "Total nominal cicilan harus sama dengan total tagihan", [
    { field: "installmentAmounts", message: "Total nominal cicilan harus sama dengan total tagihan" }
  ]),
  alreadyIssued: () => new AppError("INVOICE_ALREADY_ISSUED", 409, "Tagihan sudah diterbitkan sebelumnya"),
  notIssued: () => new AppError("INVOICE_NOT_ISSUED", 409, "Tagihan belum diterbitkan sehingga belum dapat diverifikasi"),
  alreadySettled: () => new AppError("PAYMENT_ALREADY_SETTLED", 409, "Tagihan sudah lunas atau dibatalkan"),
  noPendingProof: () => new AppError(
    "NO_PENDING_PROOF",
    409,
    "Tidak ada bukti pembayaran baru yang menunggu verifikasi untuk tagihan ini"
  ),
  proofRequired: () => new AppError("PROOF_REQUIRED", 400, "Bukti pembayaran wajib diunggah", [
    { field: "proof", message: "Bukti pembayaran wajib diunggah" }
  ]),
  concurrentUpdate: () => new AppError("PAYMENT_CONFLICT", 409, "Tagihan baru saja diperbarui, silakan muat ulang lalu coba lagi"),
  codeGenerationFailed: () => new AppError("CODE_GENERATION_FAILED", 503, "Gagal membuat nomor dokumen, silakan coba lagi")
};

// src/utils/retry.ts
async function retryOnUnique(operation, { attempts = MAX_CODE_COLLISION_RETRIES, onExhausted }) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (attempt >= attempts) throw onExhausted();
    }
  }
}

// src/utils/value.ts
function blankToNull(value) {
  return value === void 0 || value === "" ? null : value;
}

// src/services/admin/payment.policy.ts
var Decimal3 = prismaNamespace_exports.Decimal;
function parseInstallmentAmounts(value) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return value.map((item) => new Decimal3(String(item)));
}
function getInvoiceState({ issuedAt }) {
  return issuedAt ? "issued" : "draft";
}
function isSettled({ status }) {
  return SETTLED_PAYMENT_STATUSES.includes(status);
}
function hasPendingProof({ proofImage, paymentDate, verifiedAt }) {
  if (!proofImage || !paymentDate) return false;
  return !verifiedAt || paymentDate > verifiedAt;
}
function canIssue(payment) {
  return !payment.issuedAt && !isSettled(payment);
}
function canVerify(payment) {
  return !!payment.issuedAt && !isSettled(payment) && hasPendingProof(payment);
}
function assertInstallmentsMatchAmount(amount, installmentAmounts) {
  if (!installmentAmounts?.length) return;
  const total = installmentAmounts.reduce((sum, item) => sum.plus(item), new Decimal3(0));
  if (!total.equals(amount)) throw PaymentErrors.installmentMismatch();
}
function assertCanIssue(payment) {
  if (payment.issuedAt) throw PaymentErrors.alreadyIssued();
  if (isSettled(payment)) throw PaymentErrors.alreadySettled();
}
function assertCanVerify(payment) {
  if (!payment.issuedAt) throw PaymentErrors.notIssued();
  if (isSettled(payment)) throw PaymentErrors.alreadySettled();
  if (!hasPendingProof(payment)) throw PaymentErrors.noPendingProof();
}
function calculateVerification(payment) {
  const installments = parseInstallmentAmounts(payment.installmentAmounts);
  if (!installments) {
    return {
      status: "paid",
      amountPaid: payment.amount,
      amountChanged: payment.amount.minus(payment.amountPaid),
      currentInstallmentNumber: payment.currentInstallmentNumber,
      settled: true,
      installmentPaid: null
    };
  }
  const installmentNumber = payment.currentInstallmentNumber + 1;
  if (installmentNumber > installments.length) throw PaymentErrors.alreadySettled();
  const installmentAmount = installments[installmentNumber - 1];
  const settled = installmentNumber === installments.length;
  return {
    status: settled ? "paid" : `installment_${installmentNumber}`,
    amountPaid: settled ? payment.amount : payment.amountPaid.plus(installmentAmount),
    amountChanged: installmentAmount,
    currentInstallmentNumber: installmentNumber,
    settled,
    installmentPaid: installmentNumber
  };
}

// src/services/admin/payment.mapper.ts
var paymentListInclude = {
  registration: {
    select: {
      id: true,
      registrationCode: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      program: { select: { id: true, name: true, programFormat: true } }
    }
  },
  verifiedByUser: { select: { id: true, name: true } }
};
var paymentDetailInclude = {
  ...paymentListInclude,
  paymentHistory: {
    orderBy: [{ changedAt: "desc" }, { id: "desc" }],
    include: { changedByUser: { select: { id: true, name: true } } }
  }
};
var decimalOrNull = (value) => value ? value.toString() : null;
function toInstallment(payment) {
  const amounts = parseInstallmentAmounts(payment.installmentAmounts);
  if (!amounts) return null;
  return {
    current: payment.currentInstallmentNumber,
    total: amounts.length,
    amounts: amounts.map((amount) => amount.toString())
  };
}
function toPaymentItem(payment) {
  const { registration, verifiedByUser } = payment;
  const user = registration?.user;
  const program = registration?.program;
  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    receiptNumber: payment.receiptNumber,
    status: payment.status,
    invoiceState: getInvoiceState(payment),
    isManualInvoice: payment.isManualInvoice,
    issuedAt: payment.issuedAt,
    amount: payment.amount.toString(),
    amountPaid: payment.amountPaid.toString(),
    remainingAmount: payment.amount.minus(payment.amountPaid).toString(),
    paymentMethod: payment.paymentMethod,
    dueDate: toDateOnly(payment.dueDate),
    nextDueDate: toDateOnly(payment.nextDueDate),
    paymentDate: payment.paymentDate,
    proofImage: payment.proofImage,
    verifiedAt: payment.verifiedAt,
    verifiedBy: verifiedByUser ? { id: verifiedByUser.id, name: verifiedByUser.name } : null,
    notes: payment.notes,
    installment: toInstallment(payment),
    registration: { id: registration?.id ?? 0, registrationCode: registration?.registrationCode ?? "" },
    participant: {
      userId: user?.id ?? null,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? null
    },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null
    },
    actions: { canIssue: canIssue(payment), canVerify: canVerify(payment) }
  };
}
function toHistoryItem(entry) {
  return {
    id: entry.id,
    oldStatus: entry.oldStatus,
    newStatus: entry.newStatus,
    amountChanged: decimalOrNull(entry.amountChanged),
    oldAmountPaid: decimalOrNull(entry.oldAmountPaid),
    newAmountPaid: decimalOrNull(entry.newAmountPaid),
    notes: entry.notes,
    changedBy: entry.changedByUser ? { id: entry.changedByUser.id, name: entry.changedByUser.name } : null,
    changedAt: entry.changedAt
  };
}
function toPaymentDetail(payment) {
  return { ...toPaymentItem(payment), history: payment.paymentHistory.map(toHistoryItem) };
}

// src/services/admin/payment.service.ts
function buildWhere3({ search, status, invoiceState }) {
  return {
    ...status ? { status } : {},
    ...invoiceState === "draft" ? { issuedAt: null } : {},
    ...invoiceState === "issued" ? { issuedAt: { not: null } } : {},
    ...search ? {
      OR: [
        { invoiceNumber: { contains: search } },
        { registration: { registrationCode: { contains: search } } },
        { registration: { user: { name: { contains: search } } } },
        { registration: { user: { email: { contains: search } } } }
      ]
    } : {}
  };
}
async function recordHistory(tx, paymentId, adminId, entry) {
  await tx.paymentHistory.create({ data: { paymentId, changedBy: adminId, ...entry } });
}
function joinNotes(...parts) {
  return parts.filter(Boolean).join(" \u2014 ");
}
async function loadDetail(db, id) {
  const payment = await db.payment.findUniqueOrThrow({ where: { id }, include: paymentDetailInclude });
  return toPaymentDetail(payment);
}
async function getSummary3() {
  const [totalInvoices, drafts, outstanding, paid, collected] = await Promise.all([
    prisma_default.payment.count(),
    prisma_default.payment.count({ where: { issuedAt: null } }),
    prisma_default.payment.count({ where: { issuedAt: { not: null }, status: { notIn: SETTLED_PAYMENT_STATUSES } } }),
    prisma_default.payment.count({ where: { status: "paid" } }),
    prisma_default.payment.aggregate({ _sum: { amountPaid: true } })
  ]);
  return { totalInvoices, drafts, outstanding, paid, totalCollected: (collected._sum.amountPaid ?? 0).toString() };
}
function getOptions2() {
  return { statuses: Object.values(PaymentStatus), invoiceStates: [...INVOICE_STATE_VALUES] };
}
async function listPayments(filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildWhere3(filters2);
  const [total, payments] = await Promise.all([
    prisma_default.payment.count({ where }),
    prisma_default.payment.findMany({
      where,
      include: paymentListInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take
    })
  ]);
  return { items: payments.map(toPaymentItem), meta: buildPaginationMeta(total, page, limit) };
}
async function getPaymentById(id) {
  const payment = await prisma_default.payment.findUnique({ where: { id }, include: paymentDetailInclude });
  if (!payment) throw PaymentErrors.notFound();
  return toPaymentDetail(payment);
}
async function createInvoice(input, adminId) {
  const { registrationId, amount, installmentAmounts } = input;
  assertInstallmentsMatchAmount(amount, installmentAmounts);
  const dueDate = blankToNull(input.dueDate);
  const notes = blankToNull(input.notes);
  return retryOnUnique(
    () => prisma_default.$transaction(async (tx) => {
      const registration = await tx.registration.findUnique({ where: { id: registrationId }, select: { id: true } });
      if (!registration) throw PaymentErrors.registrationNotFound();
      const created = await tx.payment.create({
        data: {
          registrationId,
          invoiceNumber: await nextInvoiceNumber(tx),
          amount,
          dueDate,
          nextDueDate: dueDate,
          notes,
          isManualInvoice: true,
          ...installmentAmounts?.length ? { installmentAmounts } : {}
        }
      });
      await recordHistory(tx, created.id, adminId, {
        oldStatus: null,
        newStatus: created.status,
        notes: "Tagihan dibuat (draft)"
      });
      return loadDetail(tx, created.id);
    }),
    { onExhausted: PaymentErrors.codeGenerationFailed }
  );
}
async function issueInvoice(id, input, adminId) {
  return prisma_default.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id }, include: { registration: { select: { userId: true } } } });
    if (!payment) throw PaymentErrors.notFound();
    assertCanIssue(payment);
    const dueDate = blankToNull(input.dueDate) ?? payment.dueDate;
    const { count } = await tx.payment.updateMany({
      where: { id, issuedAt: null },
      data: { issuedAt: /* @__PURE__ */ new Date(), dueDate, nextDueDate: dueDate }
    });
    if (count === 0) throw PaymentErrors.alreadyIssued();
    await recordHistory(tx, id, adminId, {
      oldStatus: payment.status,
      newStatus: payment.status,
      notes: "Tagihan diterbitkan"
    });
    await createPaymentNotification(
      tx,
      payment.registration?.userId,
      id,
      buildInvoiceIssuedNotification({ invoiceNumber: payment.invoiceNumber, amount: payment.amount, dueDate })
    );
    return loadDetail(tx, id);
  });
}
async function verifyPayment(id, input, adminId) {
  const verify2 = () => prisma_default.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id },
      include: { registration: { select: { userId: true } } }
    });
    if (!payment) throw PaymentErrors.notFound();
    assertCanVerify(payment);
    const result = calculateVerification(payment);
    const receiptNumber = await nextReceiptNumber(tx);
    const now = /* @__PURE__ */ new Date();
    const { count } = await tx.payment.updateMany({
      where: { id, updatedAt: payment.updatedAt },
      data: {
        status: result.status,
        amountPaid: result.amountPaid,
        currentInstallmentNumber: result.currentInstallmentNumber,
        nextDueDate: result.settled ? null : blankToNull(input.nextDueDate) ?? payment.nextDueDate,
        receiptNumber,
        verifiedBy: adminId,
        verifiedAt: now
      }
    });
    if (count === 0) throw PaymentErrors.concurrentUpdate();
    await recordHistory(tx, id, adminId, {
      oldStatus: payment.status,
      newStatus: result.status,
      oldAmountPaid: payment.amountPaid,
      newAmountPaid: result.amountPaid,
      amountChanged: result.amountChanged,
      notes: joinNotes(`Pembayaran diverifikasi, kwitansi ${receiptNumber}`, blankToNull(input.notes))
    });
    await createPaymentNotification(
      tx,
      payment.registration?.userId,
      id,
      buildPaymentVerifiedNotification(payment.invoiceNumber, result)
    );
    return loadDetail(tx, id);
  });
  return retryOnUnique(verify2, { onExhausted: PaymentErrors.codeGenerationFailed });
}

// src/services/admin/admin.invoicePdf.ts
import fs7 from "fs";
import path8 from "path";
import PDFDocument from "pdfkit";
var MARGIN = 50;
var FONT = { regular: "Helvetica", bold: "Helvetica-Bold", italic: "Helvetica-Oblique" };
var BODY_SIZE = 10;
var LINE_GAP = 3;
var LETTER_BOX = { labelWidth: 150, padding: 14, rowGap: 8 };
function assetPath(file) {
  const fullPath = path8.join(process.cwd(), ...INVOICE_ASSETS.folder, file);
  return fs7.existsSync(fullPath) ? fullPath : null;
}
function resolveBilling(invoice) {
  const { installment } = invoice;
  if (!installment) {
    return {
      description: invoice.notes || "Biaya Program",
      amount: invoice.amount,
      installmentNumber: null
    };
  }
  const index22 = Math.min(installment.current, installment.total - 1);
  return {
    description: `Cicilan Ke-${index22 + 1} Biaya Program`,
    amount: installment.amounts[index22],
    installmentNumber: index22 + 1
  };
}
function buildLetterNumber(invoice, date) {
  const sequence = parseInt(invoice.invoiceNumber.split("-").pop() ?? "", 10);
  const { roman, year } = getRomanMonthYear(date);
  const prefix = Number.isNaN(sequence) ? invoice.invoiceNumber : String(sequence);
  return `${prefix}/${INVOICE_ISSUER.letterCode}/${roman}/${year}`;
}
function buildNotes(invoice) {
  const deadline = invoice.nextDueDate ?? invoice.dueDate;
  const lines = [];
  if (deadline) {
    lines.push(`Batas akhir pembayaran s.d ${formatDate(deadline)}, pukul ${INVOICE_ISSUER.paymentDeadlineTime}`);
  }
  if (invoice.notes) lines.push(invoice.notes);
  return lines.length > 0 ? lines : ["-"];
}
function setFont(doc, font = FONT.regular, size = BODY_SIZE) {
  return doc.font(font).fontSize(size).fillColor("#000000");
}
function contentWidth(doc) {
  return doc.page.width - MARGIN * 2;
}
function drawLetterhead(doc, invoice) {
  const logo = assetPath(INVOICE_ASSETS.logo);
  if (logo) doc.image(logo, MARGIN + 10, 42, { width: 130 });
  const textX = 220;
  setFont(doc, FONT.bold, 10).text(INVOICE_ISSUER.name, textX, 46);
  setFont(doc, FONT.regular, 8);
  [...INVOICE_ISSUER.addressLines, `Telp: ${INVOICE_ISSUER.phone}`, INVOICE_ISSUER.website].forEach(
    (line) => doc.text(line, textX, doc.y + 1)
  );
  if (invoice.invoiceState === "draft") {
    setFont(doc, FONT.bold, 8).fillColor("#b91c1c").text("DRAFT - BELUM DITERBITKAN", textX, doc.y + 4);
  }
}
function drawRecipient(doc, invoice, billing, letterDate) {
  doc.x = MARGIN;
  doc.y = 135;
  setFont(doc).text(`${INVOICE_ISSUER.city}, ${formatDate(letterDate)}`, MARGIN, doc.y);
  doc.text(`No: ${buildLetterNumber(invoice, letterDate)}`, MARGIN, doc.y + 4);
  doc.text("Kepada Yth.", MARGIN, doc.y + 12);
  setFont(doc, FONT.bold).text(invoice.participant.name, MARGIN, doc.y + 1);
  const subject = billing.installmentNumber ? `Invoice Cicilan Ke-${billing.installmentNumber} ${invoice.program.name}` : `Invoice ${invoice.notes || invoice.program.name}`;
  setFont(doc, FONT.bold).text(`Perihal: ${subject}`, MARGIN, doc.y + 18, { underline: true });
  setFont(doc, FONT.italic).text("Assalamu\u2019alaikum Warahmatullahi Wabarakatuh.", MARGIN, doc.y + 18);
  setFont(doc).text("Salam hormat,", MARGIN, doc.y + 12);
}
function drawIntroduction(doc, invoice, billing) {
  const scheme = billing.installmentNumber ? " melalui skema cicilan" : "";
  const program = invoice.program.name;
  setFont(doc).text(
    `Terimakasih atas kepercayaan yang diberikan kepada ${INVOICE_ISSUER.name} untuk ikut serta dalam pengiriman tenaga kerja melalui ${program}. Bersama ini kami sampaikan tagihan biaya ${program}${scheme}.`,
    MARGIN,
    doc.y + 6,
    { width: contentWidth(doc), align: "justify", indent: 32, lineGap: LINE_GAP }
  );
}
function drawDetailBox(doc, invoice, billing) {
  const { labelWidth, padding, rowGap } = LETTER_BOX;
  const valueX = MARGIN + padding + labelWidth + 14;
  const valueWidth = MARGIN + contentWidth(doc) - padding - valueX;
  const rows = [
    { label: "Nama Program", lines: [invoice.program.name] },
    { label: "Tagihan", lines: [formatRupiah(billing.amount)] },
    { label: "Rincian Tagihan", lines: [billing.description] },
    { label: "Rekening Tujuan", lines: [INVOICE_ISSUER.name, `Nomor Rekening ${INVOICE_ISSUER.bank.name} ${INVOICE_ISSUER.bank.accountNumber}`] },
    { label: "Catatan", lines: buildNotes(invoice) }
  ];
  setFont(doc);
  const heights = rows.map(({ lines }) => doc.heightOfString(lines.join("\n"), { width: valueWidth }));
  const boxHeight = heights.reduce((sum, h) => sum + h + rowGap, 0) + padding * 2 - rowGap;
  const top = doc.y + 18;
  doc.lineWidth(0.8).strokeColor("#000000").rect(MARGIN, top, contentWidth(doc), boxHeight).stroke();
  let y = top + padding;
  rows.forEach((row, index22) => {
    setFont(doc, FONT.bold).text(row.label, MARGIN + padding, y, { width: labelWidth });
    setFont(doc).text(":", MARGIN + padding + labelWidth, y);
    setFont(doc).text(row.lines.join("\n"), valueX, y, { width: valueWidth });
    y += heights[index22] + rowGap;
  });
  doc.y = top + boxHeight;
}
function drawClosing(doc) {
  const width = contentWidth(doc);
  setFont(doc).text("Sesuai dengan ketentuan yang berlaku, ", MARGIN, doc.y + 16, {
    width,
    align: "justify",
    indent: 32,
    lineGap: LINE_GAP,
    continued: true
  });
  setFont(doc, FONT.bold).text("seluruh pembayaran yang telah dibayarkan tidak dapat dikembalikan dengan alasan apa pun", {
    continued: true
  });
  setFont(doc).text(
    ". Harap dapat melakukan pengecekan kembali atas rincian invoice yang Anda terima. Demikian invoice yang kami berikan, atas perhatian Anda kami ucapkan terimakasih.",
    { continued: false }
  );
  setFont(doc, FONT.italic).text("Wassalamu\u2019alaikum Warahmatullahi Wabarakatuh.", MARGIN, doc.y + 12);
}
function drawSignature(doc) {
  setFont(doc).text("Hormat Kami,", MARGIN, doc.y + 16);
  const signature = assetPath(INVOICE_ASSETS.signature);
  const signatureTop = doc.y + 8;
  if (signature) doc.image(signature, MARGIN, signatureTop, { width: 210 });
  const nameY = signatureTop + (signature ? 68 : 40);
  setFont(doc, FONT.bold).text(INVOICE_ISSUER.signatory.name, MARGIN, nameY, { underline: true });
  setFont(doc).text(INVOICE_ISSUER.signatory.title, MARGIN, doc.y + 1, { underline: false });
}
function drawMotto(doc) {
  setFont(doc, FONT.italic, 7.5).text(INVOICE_ISSUER.motto, MARGIN, doc.page.height - MARGIN - 12, {
    width: contentWidth(doc),
    lineBreak: false
  });
}
function streamInvoicePdf(invoice, output) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: { Title: `Invoice ${invoice.invoiceNumber}`, Author: INVOICE_ISSUER.name }
  });
  doc.pipe(output);
  const billing = resolveBilling(invoice);
  const letterDate = invoice.issuedAt ?? /* @__PURE__ */ new Date();
  drawLetterhead(doc, invoice);
  drawRecipient(doc, invoice, billing, letterDate);
  drawIntroduction(doc, invoice, billing);
  drawDetailBox(doc, invoice, billing);
  drawClosing(doc);
  drawSignature(doc);
  drawMotto(doc);
  doc.end();
}
function sendInvoicePdf(res, invoice, download = false) {
  const disposition = download ? "attachment" : "inline";
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${disposition}; filename="${invoice.invoiceNumber}.pdf"`);
  res.setHeader("Cache-Control", "private, no-store");
  streamInvoicePdf(invoice, res);
}

// src/controllers/admin/payment.controller.ts
var currentUserId = (req) => req.user.userId;
async function summary2(_req, res) {
  const data = await getSummary3();
  return res.json({ success: true, data });
}
function options2(_req, res) {
  return res.json({ success: true, data: getOptions2() });
}
async function index15(req, res) {
  const { items, meta } = await listPayments(matchedData5(req));
  return res.json({ success: true, data: items, meta });
}
async function show13(req, res) {
  const { id } = matchedData5(req);
  const data = await getPaymentById(id);
  return res.json({ success: true, data });
}
async function store8(req, res) {
  const data = await createInvoice(matchedData5(req), currentUserId(req));
  return res.status(201).json({ success: true, message: "Tagihan berhasil dibuat sebagai draft", data });
}
async function issue(req, res) {
  const { id, ...input } = matchedData5(req);
  const data = await issueInvoice(id, input, currentUserId(req));
  return res.json({ success: true, message: "Tagihan berhasil diterbitkan", data });
}
async function verify(req, res) {
  const { id, ...input } = matchedData5(req);
  const data = await verifyPayment(id, input, currentUserId(req));
  return res.json({ success: true, message: "Pembayaran berhasil diverifikasi", data });
}
async function invoicePdf(req, res) {
  const { id, download } = matchedData5(req);
  const invoice = await getPaymentById(id);
  sendInvoicePdf(res, invoice, download);
}

// src/validators/payment.validator.ts
import { body as body6, query as query4 } from "express-validator";
var STATUS_VALUES2 = Object.values(PaymentStatus);
var listPaymentsRules = [
  ...paginationRules,
  searchRule,
  enumQueryRule("status", "Status pembayaran", STATUS_VALUES2),
  enumQueryRule("invoiceState", "Status tagihan", [...INVOICE_STATE_VALUES])
];
var listMyPaymentsRules = [
  ...paginationRules,
  enumQueryRule("status", "Status pembayaran", STATUS_VALUES2)
];
var paymentIdRules = [idParamRule];
var exportInvoiceRules = [
  idParamRule,
  query4("download").optional({ values: "falsy" }).isBoolean().withMessage("download harus true atau false").toBoolean()
];
var createInvoiceRules = [
  intRule("registrationId", { label: "ID pendaftaran", min: 1 }),
  decimalRule("amount", { label: "Total tagihan", min: 1, max: PAYMENT_LIMITS.amountMax }),
  dateRule("dueDate", { label: "Jatuh tempo", nullable: true }),
  body6("installmentAmounts").optional({ values: "null" }).isArray({ min: PAYMENT_LIMITS.installmentMin, max: PAYMENT_LIMITS.installmentMax }).withMessage(
    `Cicilan harus berupa daftar nominal ${PAYMENT_LIMITS.installmentMin} sampai ${PAYMENT_LIMITS.installmentMax} item`
  ),
  body6("installmentAmounts.*").isFloat({ min: 1, max: PAYMENT_LIMITS.amountMax }).withMessage("Nominal cicilan harus berupa angka lebih dari 0").toFloat(),
  textRule("notes", { label: "Catatan", max: PAYMENT_LIMITS.notes, nullable: true })
];
var issueInvoiceRules = [
  idParamRule,
  dateRule("dueDate", { label: "Jatuh tempo", nullable: true })
];
var verifyPaymentRules = [
  idParamRule,
  dateRule("nextDueDate", { label: "Jatuh tempo cicilan berikutnya", nullable: true }),
  textRule("notes", { label: "Catatan verifikasi", max: PAYMENT_LIMITS.notes, nullable: true })
];

// src/routes/admin/payment.routes.ts
var router20 = Router20();
router20.use(...superAdminAccess);
router20.get("/summary", summary2);
router20.get("/options", options2);
router20.get("/", validate(listPaymentsRules), index15);
router20.post("/", validate(createInvoiceRules), store8);
router20.get("/:id", validate(paymentIdRules), show13);
router20.get("/:id/invoice", validate(exportInvoiceRules), invoicePdf);
router20.post("/:id/issue", validate(issueInvoiceRules), issue);
router20.post("/:id/verify", validate(verifyPaymentRules), verify);
var payment_routes_default = router20;

// src/routes/user/payment.routes.ts
import { Router as Router21 } from "express";

// src/controllers/user/payment.controller.ts
import { matchedData as matchedData6 } from "express-validator";

// src/services/user/payment.policy.ts
var Decimal4 = prismaNamespace_exports.Decimal;
function getPaymentState(payment) {
  if (payment.status === "cancelled") return "cancelled";
  if (payment.status === "paid") return "paid";
  return hasPendingProof(payment) ? "awaiting_verification" : "awaiting_payment";
}
function getPaymentDeadline({ nextDueDate, dueDate }) {
  return nextDueDate ?? dueDate;
}
function isOverdue(payment, now = /* @__PURE__ */ new Date()) {
  if (getPaymentState(payment) !== "awaiting_payment") return false;
  const deadline = getPaymentDeadline(payment);
  return !!deadline && now > endOfDeadlineDay(deadline);
}
function getAmountDue(payment) {
  if (isSettled(payment)) return new Decimal4(0);
  const installments = parseInstallmentAmounts(payment.installmentAmounts);
  if (!installments) return payment.amount.minus(payment.amountPaid);
  return installments[payment.currentInstallmentNumber] ?? new Decimal4(0);
}
function canUploadProof(payment) {
  return !!payment.issuedAt && !isSettled(payment);
}
function assertCanUploadProof(payment) {
  if (!payment.issuedAt) throw PaymentErrors.notFound();
  if (isSettled(payment)) throw PaymentErrors.alreadySettled();
}

// src/services/user/payment.mapper.ts
var Decimal5 = prismaNamespace_exports.Decimal;
var myPaymentInclude = {
  registration: {
    select: {
      id: true,
      registrationCode: true,
      program: { select: { id: true, name: true, programFormat: true } }
    }
  }
};
var myPaymentDetailInclude = {
  ...myPaymentInclude,
  paymentHistory: { orderBy: [{ changedAt: "desc" }, { id: "desc" }] }
};
var sumDecimals = (values) => values.reduce((total, value) => total.plus(value), new Decimal5(0));
function toPaymentAccount(payment) {
  if (isSettled(payment)) return null;
  return {
    bankName: INVOICE_ISSUER.bank.name,
    accountNumber: INVOICE_ISSUER.bank.accountNumber,
    accountHolder: INVOICE_ISSUER.name
  };
}
function toHistoryItem2(entry) {
  return {
    id: entry.id,
    oldStatus: entry.oldStatus,
    newStatus: entry.newStatus,
    amountChanged: entry.amountChanged?.toString() ?? null,
    changedAt: entry.changedAt
  };
}
function toMyPaymentItem(payment) {
  const { registration } = payment;
  const program = registration?.program;
  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    receiptNumber: payment.receiptNumber,
    status: payment.status,
    state: getPaymentState(payment),
    isOverdue: isOverdue(payment),
    issuedAt: payment.issuedAt,
    amount: payment.amount.toString(),
    amountPaid: payment.amountPaid.toString(),
    remainingAmount: payment.amount.minus(payment.amountPaid).toString(),
    amountDue: getAmountDue(payment).toString(),
    paymentMethod: payment.paymentMethod,
    dueDate: toDateOnly(payment.dueDate),
    nextDueDate: toDateOnly(payment.nextDueDate),
    deadline: toDateOnly(getPaymentDeadline(payment)),
    paymentDate: payment.paymentDate,
    proofImage: payment.proofImage,
    verifiedAt: payment.verifiedAt,
    notes: payment.notes,
    installment: toInstallment(payment),
    registration: { id: registration?.id ?? 0, registrationCode: registration?.registrationCode ?? "" },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null
    },
    actions: { canUploadProof: canUploadProof(payment) }
  };
}
function toMyPaymentDetail(payment) {
  return {
    ...toMyPaymentItem(payment),
    paymentAccount: toPaymentAccount(payment),
    history: payment.paymentHistory.map(toHistoryItem2)
  };
}
function toPaymentSummary(payments) {
  const active = payments.filter(({ status }) => status !== "cancelled");
  const countByState = (state) => active.filter((payment) => getPaymentState(payment) === state).length;
  const totalAmount = sumDecimals(active.map(({ amount }) => amount));
  const totalPaid = sumDecimals(active.map(({ amountPaid }) => amountPaid));
  return {
    totalInvoices: active.length,
    awaitingPayment: countByState("awaiting_payment"),
    awaitingVerification: countByState("awaiting_verification"),
    paid: countByState("paid"),
    overdue: active.filter((payment) => isOverdue(payment)).length,
    totalAmount: totalAmount.toString(),
    totalPaid: totalPaid.toString(),
    totalRemaining: totalAmount.minus(totalPaid).toString()
  };
}

// src/services/user/payment.service.ts
var ownedIssuedPayments = (userId) => ({
  issuedAt: { not: null },
  registration: { userId }
});
async function loadMyPayment(db, userId, id) {
  const payment = await db.payment.findFirst({
    where: { id, ...ownedIssuedPayments(userId) },
    include: myPaymentDetailInclude
  });
  if (!payment) throw PaymentErrors.notFound();
  return toMyPaymentDetail(payment);
}
async function getMySummary(userId) {
  const payments = await prisma_default.payment.findMany({ where: ownedIssuedPayments(userId) });
  return toPaymentSummary(payments);
}
async function listMyPayments(userId, filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = {
    ...ownedIssuedPayments(userId),
    ...filters2.status ? { status: filters2.status } : {}
  };
  const [total, payments] = await Promise.all([
    prisma_default.payment.count({ where }),
    prisma_default.payment.findMany({
      where,
      include: myPaymentInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take
    })
  ]);
  return { items: payments.map(toMyPaymentItem), meta: buildPaginationMeta(total, page, limit) };
}
function getMyPayment(userId, id) {
  return loadMyPayment(prisma_default, userId, id);
}
async function getMyInvoice(userId, id) {
  const payment = await prisma_default.payment.findFirst({
    where: { id, ...ownedIssuedPayments(userId) },
    include: paymentDetailInclude
  });
  if (!payment) throw PaymentErrors.notFound();
  return toPaymentDetail(payment);
}
async function submitPaymentProof(userId, id, proofPath) {
  const { detail, replacedProof } = await prisma_default.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({ where: { id, ...ownedIssuedPayments(userId) } });
    if (!payment) throw PaymentErrors.notFound();
    assertCanUploadProof(payment);
    const replacing = hasPendingProof(payment);
    const { count } = await tx.payment.updateMany({
      where: { id, updatedAt: payment.updatedAt },
      data: { proofImage: proofPath, paymentDate: /* @__PURE__ */ new Date() }
    });
    if (count === 0) throw PaymentErrors.concurrentUpdate();
    await tx.paymentHistory.create({
      data: {
        paymentId: id,
        changedBy: userId,
        oldStatus: payment.status,
        newStatus: payment.status,
        notes: replacing ? PAYMENT_PROOF_HISTORY_NOTES.replaced : PAYMENT_PROOF_HISTORY_NOTES.uploaded
      }
    });
    return { detail: await loadMyPayment(tx, userId, id), replacedProof: replacing ? payment.proofImage : null };
  });
  await removePublicUpload(replacedProof);
  return detail;
}

// src/controllers/user/payment.controller.ts
var currentUserId2 = (req) => req.user.userId;
async function summary3(req, res) {
  const data = await getMySummary(currentUserId2(req));
  return res.json({ success: true, data });
}
async function index16(req, res) {
  const { items, meta } = await listMyPayments(currentUserId2(req), matchedData6(req));
  return res.json({ success: true, data: items, meta });
}
async function show14(req, res) {
  const { id } = matchedData6(req);
  const data = await getMyPayment(currentUserId2(req), id);
  return res.json({ success: true, data });
}
async function invoicePdf2(req, res) {
  const { id, download } = matchedData6(req);
  const invoice = await getMyInvoice(currentUserId2(req), id);
  sendInvoicePdf(res, invoice, download);
}
async function uploadProof(req, res) {
  const { id } = matchedData6(req);
  if (!req.file) throw PaymentErrors.proofRequired();
  const proofPath = toPublicUploadPath(PAYMENT_PROOF_UPLOAD_FOLDER, req.file.filename);
  const data = await withUploadCleanup(
    proofPath,
    () => submitPaymentProof(currentUserId2(req), id, proofPath)
  );
  return res.json({ success: true, message: "Bukti pembayaran berhasil diunggah", data });
}

// src/routes/user/payment.routes.ts
var router21 = Router21();
router21.use(authenticate);
router21.get("/summary", summary3);
router21.get("/", validate(listMyPaymentsRules), index16);
router21.get("/:id", validate(paymentIdRules), show14);
router21.get("/:id/invoice", validate(exportInvoiceRules), invoicePdf2);
router21.post("/:id/proof", uploadPaymentProof.single("proof"), validate(paymentIdRules), uploadProof);
var payment_routes_default2 = router21;

// src/routes/user/notification.routes.ts
import { Router as Router22 } from "express";

// src/services/user/notification.service.ts
async function getMyNotifications(userId) {
  return prisma_default.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}
async function markAsRead(userId, id) {
  const notification = await prisma_default.notification.findFirst({ where: { id, userId } });
  if (!notification) throw new Error("NOTIFICATION_NOT_FOUND");
  return prisma_default.notification.update({ where: { id }, data: { isRead: true } });
}
async function markAllAsRead(userId) {
  await prisma_default.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
}
async function getUnreadCount(userId) {
  return prisma_default.notification.count({ where: { userId, isRead: false } });
}

// src/controllers/user/notification.controller.ts
async function index17(req, res) {
  try {
    const notifications = await getMyNotifications(req.user.userId);
    const unreadCount = await getUnreadCount(req.user.userId);
    return res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    console.error("Get my notifications error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function markRead(req, res) {
  try {
    const id = parseInt(req.params.id);
    const notification = await markAsRead(req.user.userId, id);
    return res.json({ success: true, message: "Notifikasi ditandai terbaca", data: notification });
  } catch (error) {
    if (error.message === "NOTIFICATION_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Notifikasi tidak ditemukan" });
    }
    console.error("Mark notification read error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
async function markAllRead(req, res) {
  try {
    await markAllAsRead(req.user.userId);
    return res.json({ success: true, message: "Semua notifikasi ditandai terbaca" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

// src/routes/user/notification.routes.ts
var router22 = Router22();
router22.use(authenticate);
router22.get("/", index17);
router22.patch("/:id/read", markRead);
router22.patch("/read-all", markAllRead);
var notification_routes_default = router22;

// src/routes/admin/dashboard.routes.ts
import { Router as Router23 } from "express";

// src/controllers/admin/dashboard.controller.ts
import { matchedData as matchedData7 } from "express-validator";

// src/errors/dashboard.errors.ts
var DashboardErrors = {
  registrationNotFound: () => new AppError("REGISTRATION_NOT_FOUND", 404, "Data pendaftaran tidak ditemukan")
};

// src/services/admin/dashboard.mapper.ts
var registrationListInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  program: { select: { id: true, name: true, programFormat: true, trainingCost: true } },
  payments: {
    orderBy: { createdAt: "desc" },
    take: 1,
    select: {
      invoiceNumber: true,
      status: true,
      amount: true,
      amountPaid: true,
      nextDueDate: true,
      currentInstallmentNumber: true,
      installmentAmounts: true
    }
  },
  selectionStatuses: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } },
  placementStatuses: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } }
};
var registrationDetailInclude = {
  user: { select: { name: true, email: true, phone: true } },
  program: {
    select: { id: true, name: true, programFormat: true, trainingCost: true, installmentPlan: true }
  },
  payments: { orderBy: { createdAt: "desc" } },
  selectionStatuses: { orderBy: { createdAt: "desc" } },
  placementStatuses: { orderBy: { createdAt: "desc" } },
  statusHistory: { orderBy: { changedAt: "desc" } }
};
function countInstallments(installmentAmounts) {
  return Array.isArray(installmentAmounts) && installmentAmounts.length > 0 ? installmentAmounts.length : null;
}
function toRegistrationListItem(registration) {
  const { user, program } = registration;
  const [payment] = registration.payments;
  const [selection] = registration.selectionStatuses;
  const [placement] = registration.placementStatuses;
  const installmentTotal = payment ? countInstallments(payment.installmentAmounts) : null;
  return {
    id: registration.id,
    registrationCode: registration.registrationCode,
    registrationDate: registration.registrationDate,
    participant: {
      userId: user?.id ?? null,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? null,
      photoPath: registration.photoPath
    },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
      trainingCost: program?.trainingCost.toString() ?? "0"
    },
    payment: payment ? {
      invoiceNumber: payment.invoiceNumber,
      status: payment.status,
      amount: payment.amount.toString(),
      amountPaid: payment.amountPaid.toString(),
      nextDueDate: toDateOnly(payment.nextDueDate),
      installment: installmentTotal !== null && payment.currentInstallmentNumber > 0 ? { current: payment.currentInstallmentNumber, total: installmentTotal } : null
    } : null,
    progress: {
      interview: registration.registrationStatus,
      selection: selection?.status ?? null,
      placement: placement?.status ?? null
    },
    documents: {
      n4CertificatePath: registration.n4CertificatePath,
      sswCertificatePath: registration.sswCertificatePath
    }
  };
}
function toRegistrationDetail(registration) {
  const { program } = registration;
  return {
    registrationId: registration.id,
    registrationCode: registration.registrationCode,
    registrationDate: registration.registrationDate,
    registrationStatus: registration.registrationStatus,
    selectionNotes: registration.selectionNotes,
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
      trainingCost: program?.trainingCost.toString() ?? "0",
      installmentPlan: program?.installmentPlan ?? null
    },
    applicant: toApplicant(registration),
    documents: toDocuments(registration),
    payments: registration.payments.map((payment) => ({
      id: payment.id,
      invoiceNumber: payment.invoiceNumber,
      status: payment.status,
      amount: payment.amount.toString(),
      amountPaid: payment.amountPaid.toString(),
      paymentMethod: payment.paymentMethod,
      dueDate: toDateOnly(payment.dueDate),
      nextDueDate: toDateOnly(payment.nextDueDate),
      paymentDate: payment.paymentDate,
      proofImage: payment.proofImage,
      notes: payment.notes
    })),
    selections: registration.selectionStatuses.map((selection) => ({
      status: selection.status,
      notes: selection.notes,
      evaluatedAt: selection.evaluatedAt
    })),
    placements: registration.placementStatuses.map((placement) => ({
      status: placement.status,
      companyName: placement.companyName,
      placementDate: toDateOnly(placement.placementDate),
      notes: placement.notes
    })),
    statusHistory: registration.statusHistory.map((history) => ({
      oldStatus: history.oldStatus,
      newStatus: history.newStatus,
      notes: history.notes,
      changedAt: history.changedAt
    }))
  };
}

// src/services/admin/dashboard.service.ts
var MS_PER_DAY = 864e5;
function buildRegistrationWhere(filters2) {
  const { search, programId, paymentStatus, selectionStatus, placementStatus } = filters2;
  return {
    ...programId ? { programId } : {},
    ...paymentStatus ? { payments: { some: { status: paymentStatus } } } : {},
    ...selectionStatus ? { selectionStatuses: { some: { status: selectionStatus } } } : {},
    ...placementStatus ? { placementStatuses: { some: { status: placementStatus } } } : {},
    ...search ? {
      OR: [
        { registrationCode: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { user: { phone: { contains: search } } }
      ]
    } : {}
  };
}
async function getSummary4(now = /* @__PURE__ */ new Date()) {
  const since = new Date(now.getTime() - NEW_REGISTRANT_WINDOW_DAYS * MS_PER_DAY);
  const [totalRegistrants, newRegistrants, revenue, pendingVerification] = await Promise.all([
    prisma_default.registration.count(),
    prisma_default.registration.count({ where: { registrationDate: { gte: since } } }),
    prisma_default.payment.aggregate({
      where: { status: { in: REVENUE_PAYMENT_STATUSES } },
      _sum: { amountPaid: true },
      _count: { _all: true }
    }),
    prisma_default.payment.count({ where: { status: { in: PENDING_ACTION_PAYMENT_STATUSES } } })
  ]);
  return {
    totalRegistrants,
    newRegistrants: { count: newRegistrants, windowDays: NEW_REGISTRANT_WINDOW_DAYS },
    revenue: {
      total: (revenue._sum.amountPaid ?? 0).toString(),
      paidCount: revenue._count._all
    },
    pendingVerification
  };
}
async function getFilterOptions() {
  const programs = await prisma_default.program.findMany({
    select: { id: true, name: true, programFormat: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
  return {
    programs,
    paymentStatuses: Object.values(PaymentStatus),
    selectionStatuses: Object.values(RegistrationStatus),
    placementStatuses: Object.values(PlacementStage)
  };
}
async function listRegistrations(filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildRegistrationWhere(filters2);
  const [total, registrations2] = await Promise.all([
    prisma_default.registration.count({ where }),
    prisma_default.registration.findMany({
      where,
      include: registrationListInclude,
      orderBy: { registrationDate: "desc" },
      skip,
      take
    })
  ]);
  return {
    items: registrations2.map(toRegistrationListItem),
    meta: buildPaginationMeta(total, page, limit)
  };
}
async function getRegistrationDetail(id) {
  const registration = await prisma_default.registration.findUnique({
    where: { id },
    include: registrationDetailInclude
  });
  if (!registration) throw DashboardErrors.registrationNotFound();
  return toRegistrationDetail(registration);
}

// src/controllers/admin/dashboard.controller.ts
async function summary4(_req, res) {
  const data = await getSummary4();
  return res.json({ success: true, data });
}
async function filters(_req, res) {
  const data = await getFilterOptions();
  return res.json({ success: true, data });
}
async function registrations(req, res) {
  const { items, meta } = await listRegistrations(matchedData7(req));
  return res.json({ success: true, data: items, meta });
}
async function registrationDetail(req, res) {
  const { id } = matchedData7(req);
  const data = await getRegistrationDetail(id);
  return res.json({ success: true, data });
}

// src/validators/dashboard.validator.ts
import { query as query5 } from "express-validator";
var listRegistrationsRules = [
  ...paginationRules,
  searchRule,
  query5("programId").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Program tidak valid").toInt(),
  enumQueryRule("paymentStatus", "Status pembayaran", Object.values(PaymentStatus)),
  enumQueryRule("selectionStatus", "Status seleksi", Object.values(RegistrationStatus)),
  enumQueryRule("placementStatus", "Status penyaluran", Object.values(PlacementStage))
];
var registrationDetailRules = [idParamRule];

// src/routes/admin/dashboard.routes.ts
var router23 = Router23();
router23.use(...superAdminAccess);
router23.get("/summary", summary4);
router23.get("/filters", filters);
router23.get("/registrations", validate(listRegistrationsRules), registrations);
router23.get("/registrations/:id", validate(registrationDetailRules), registrationDetail);
var dashboard_routes_default2 = router23;

// src/routes/admin/user.routes.ts
import { Router as Router24 } from "express";

// src/controllers/admin/user.controller.ts
import { matchedData as matchedData8 } from "express-validator";

// src/services/admin/user.service.ts
var userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { registrations: true, articles: true } }
};
function toUserItem(user, currentUserId4) {
  const relatedDataCount = user._count.registrations + user._count.articles;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    registrationsCount: user._count.registrations,
    relatedDataCount,
    canDelete: user.id !== currentUserId4 && relatedDataCount === 0
  };
}
function buildUserWhere({ search, role }) {
  return {
    ...role ? { role } : {},
    ...search ? {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ]
    } : {}
  };
}
async function assertEmailAvailable(email, excludeUserId) {
  const taken = await prisma_default.user.findFirst({
    where: { email, ...excludeUserId ? { NOT: { id: excludeUserId } } : {} },
    select: { id: true }
  });
  if (taken) throw UserErrors.emailTaken();
}
async function getSummary5() {
  const [total, roleGroups, withPhone] = await Promise.all([
    prisma_default.user.count(),
    prisma_default.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma_default.user.count({ where: { AND: [{ phone: { not: null } }, { phone: { not: "" } }] } })
  ]);
  const countByRole = (role) => roleGroups.find((group) => group.role === role)?._count._all ?? 0;
  return {
    total,
    participants: countByRole("user"),
    superAdmins: countByRole("superadmin"),
    administrators: countByRole("admin"),
    editors: countByRole("editor"),
    withPhone
  };
}
async function listUsers(filters2, currentUserId4) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildUserWhere(filters2);
  const [total, users] = await Promise.all([
    prisma_default.user.count({ where }),
    prisma_default.user.findMany({ where, select: userSelect, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip, take })
  ]);
  return {
    items: users.map((user) => toUserItem(user, currentUserId4)),
    meta: buildPaginationMeta(total, page, limit)
  };
}
async function getUserById(id, currentUserId4) {
  const user = await prisma_default.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw UserErrors.notFound();
  return toUserItem(user, currentUserId4);
}
async function createUser(input, currentUserId4) {
  await assertEmailAvailable(input.email);
  try {
    const user = await prisma_default.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role ?? "user",
        emailVerifiedAt: /* @__PURE__ */ new Date(),
        password: await hashPassword(input.password)
      },
      select: userSelect
    });
    return toUserItem(user, currentUserId4);
  } catch (error) {
    if (isUniqueViolation(error)) throw UserErrors.emailTaken();
    throw error;
  }
}
async function updateUser(id, input, currentUserId4) {
  const existing = await prisma_default.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!existing) throw UserErrors.notFound();
  if (input.role && input.role !== existing.role && id === currentUserId4) {
    throw UserErrors.cannotChangeOwnRole();
  }
  if (input.email) await assertEmailAvailable(input.email, id);
  try {
    const user = await prisma_default.user.update({
      where: { id },
      data: input,
      select: userSelect
    });
    return toUserItem(user, currentUserId4);
  } catch (error) {
    if (isUniqueViolation(error)) throw UserErrors.emailTaken();
    throw error;
  }
}
async function deleteUser(id, currentUserId4) {
  if (id === currentUserId4) throw UserErrors.cannotDeleteSelf();
  const user = await prisma_default.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw UserErrors.notFound();
  if (!toUserItem(user, currentUserId4).canDelete) throw UserErrors.hasRelatedData();
  try {
    await prisma_default.user.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyViolation(error)) throw UserErrors.hasRelatedData();
    throw error;
  }
}

// src/controllers/admin/user.controller.ts
var currentUserId3 = (req) => req.user.userId;
async function summary5(_req, res) {
  const data = await getSummary5();
  return res.json({ success: true, data });
}
async function index18(req, res) {
  const { items, meta } = await listUsers(matchedData8(req), currentUserId3(req));
  return res.json({ success: true, data: items, meta });
}
async function show15(req, res) {
  const { id } = matchedData8(req);
  const data = await getUserById(id, currentUserId3(req));
  return res.json({ success: true, data });
}
async function store9(req, res) {
  const data = await createUser(matchedData8(req), currentUserId3(req));
  return res.status(201).json({ success: true, message: "User berhasil dibuat", data });
}
async function update8(req, res) {
  const { id, ...input } = matchedData8(req);
  const data = await updateUser(id, input, currentUserId3(req));
  return res.json({ success: true, message: "User berhasil diperbarui", data });
}
async function destroy7(req, res) {
  const { id } = matchedData8(req);
  await deleteUser(id, currentUserId3(req));
  return res.json({ success: true, message: "User berhasil dihapus" });
}

// src/validators/user.validator.ts
import { body as body7 } from "express-validator";
var ROLE_VALUES = Object.values(Role);
function nameRule(required) {
  const chain = required ? body7("name").trim().notEmpty().withMessage("Nama wajib diisi").bail() : body7("name").optional().trim().notEmpty().withMessage("Nama tidak boleh kosong").bail();
  return chain.isLength({ max: 255 }).withMessage("Nama maksimal 255 karakter");
}
function emailRule2(required) {
  const chain = required ? body7("email").trim().notEmpty().withMessage("Email wajib diisi").bail() : body7("email").optional().trim().notEmpty().withMessage("Email tidak boleh kosong").bail();
  return chain.isEmail().withMessage("Format email tidak valid").bail().customSanitizer((value) => value.toLowerCase());
}
var phoneRule2 = body7("phone").optional({ values: "falsy" }).trim().matches(PHONE_PATTERN).withMessage("Nomor telepon tidak valid (contoh: 081234567890)");
var passwordRule = body7("password").notEmpty().withMessage("Password wajib diisi").bail().isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }).withMessage(`Password harus ${PASSWORD_MIN_LENGTH} sampai ${PASSWORD_MAX_LENGTH} karakter`);
var roleRule = body7("role").optional({ values: "falsy" }).isIn(ROLE_VALUES).withMessage(`Role harus salah satu dari: ${ROLE_VALUES.join(", ")}`);
var listUsersRules = [
  ...paginationRules,
  searchRule,
  enumQueryRule("role", "Role", ROLE_VALUES)
];
var userIdRules = [idParamRule];
var createUserRules = [
  nameRule(true),
  emailRule2(true),
  phoneRule2,
  passwordRule,
  roleRule
];
var updateUserRules = [
  idParamRule,
  nameRule(false),
  emailRule2(false),
  phoneRule2,
  roleRule
];

// src/routes/admin/user.routes.ts
var router24 = Router24();
router24.use(...superAdminAccess);
router24.get("/summary", summary5);
router24.get("/", validate(listUsersRules), index18);
router24.post("/", validate(createUserRules), store9);
router24.get("/:id", validate(userIdRules), show15);
router24.put("/:id", validate(updateUserRules), update8);
router24.delete("/:id", validate(userIdRules), destroy7);
var user_routes_default = router24;

// src/routes/admin/selectionPlacement.routes.ts
import { Router as Router25 } from "express";

// src/controllers/admin/selectionPlacement.controller.ts
import { matchedData as matchedData9 } from "express-validator";

// src/config/selection.config.ts
var SELECTION_PLACEMENT_LIMITS = { notes: 5e3, companyName: 191 };
var DEFAULT_SELECTION_STATUS = "menunggu";
var PASSED_SELECTION_STATUS = "lolos";
var DEFAULT_PLACEMENT_STATUS = "proses";
var COMPANY_REQUIRED_PLACEMENT_STATUSES = ["lolos", "ditempatkan"];
var DATE_REQUIRED_PLACEMENT_STATUSES = ["ditempatkan"];

// src/errors/selectionPlacement.errors.ts
var SelectionPlacementErrors = {
  notFound: () => new AppError("REGISTRATION_NOT_FOUND", 404, "Data peserta tidak ditemukan"),
  nothingToUpdate: () => new AppError("NOTHING_TO_UPDATE", 400, "Data seleksi atau penyaluran wajib dikirim minimal salah satu"),
  invalidPlacement: (issues) => new AppError("VALIDATION_ERROR", 400, "Data yang dikirim tidak valid", issues),
  selectionNotPassed: () => new AppError(
    "SELECTION_NOT_PASSED",
    409,
    "Penyaluran hanya dapat diproses untuk peserta yang lolos seleksi diklat"
  )
};

// src/services/admin/selectionPlacement.notifications.ts
var SELECTION_TITLE = "Hasil seleksi diklat";
var PLACEMENT_TITLE = "Status penyaluran kerja";
function buildSelectionNotification(status) {
  if (status === "lolos") {
    return {
      title: SELECTION_TITLE,
      message: "Selamat, Anda dinyatakan lolos seleksi diklat.",
      type: "success",
      relatedEntity: "selection"
    };
  }
  if (status === "tidak_lolos") {
    return {
      title: SELECTION_TITLE,
      message: "Mohon maaf, Anda belum dinyatakan lolos seleksi diklat.",
      type: "error",
      relatedEntity: "selection"
    };
  }
  return null;
}
function buildPlacementNotification({ status, companyName }) {
  const company = companyName ? ` di ${companyName}` : "";
  const messages = {
    lolos: `Selamat, Anda dinyatakan lolos wawancara penyaluran kerja${company}.`,
    ditempatkan: `Selamat, Anda telah ditempatkan${company}.`
  };
  const message = messages[status];
  return message ? { title: PLACEMENT_TITLE, message, type: "success", relatedEntity: "placement" } : null;
}
async function createNotification(tx, userId, registrationId, draft) {
  if (!draft) return;
  await tx.notification.create({ data: { userId, relatedEntityId: registrationId, ...draft } });
}

// src/services/admin/selectionPlacement.policy.ts
function isPlacementDetermined(placement) {
  if (!placement) return false;
  return placement.status !== "proses" || placement.companyName !== null || placement.placementDate !== null || placement.notes !== null;
}
function collectPlacementIssues({ status, companyName, placementDate }) {
  const issues = [];
  if (COMPANY_REQUIRED_PLACEMENT_STATUSES.includes(status) && !companyName) {
    issues.push({ field: "placement.companyName", message: "Nama perusahaan wajib diisi untuk status ini" });
  }
  if (DATE_REQUIRED_PLACEMENT_STATUSES.includes(status) && !placementDate) {
    issues.push({ field: "placement.placementDate", message: "Tanggal penempatan wajib diisi untuk status ini" });
  }
  return issues;
}
function assertPlacementAllowed(selection, placement) {
  const issues = collectPlacementIssues(placement);
  if (issues.length > 0) throw SelectionPlacementErrors.invalidPlacement(issues);
  if (selection !== PASSED_SELECTION_STATUS && isPlacementDetermined(placement)) {
    throw SelectionPlacementErrors.selectionNotPassed();
  }
}

// src/services/admin/selectionPlacement.mapper.ts
var LATEST = [{ createdAt: "desc" }, { id: "desc" }];
var participantInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  program: { select: { id: true, name: true, programFormat: true, duration: true } },
  selectionStatuses: { orderBy: LATEST, take: 1 },
  placementStatuses: { orderBy: LATEST, take: 1 }
};
function toParticipantItem(registration) {
  const { user, program } = registration;
  const [selection] = registration.selectionStatuses;
  const [placement] = registration.placementStatuses;
  const selectionStatus = selection?.status ?? DEFAULT_SELECTION_STATUS;
  return {
    registrationId: registration.id,
    registrationCode: registration.registrationCode,
    registrationDate: registration.registrationDate,
    participant: {
      userId: user?.id ?? null,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? null,
      photoPath: registration.photoPath
    },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
      duration: program?.duration ?? null
    },
    selection: {
      status: selectionStatus,
      notes: selection?.notes ?? null,
      evaluatedAt: selection?.evaluatedAt ?? null
    },
    placement: {
      status: placement?.status ?? DEFAULT_PLACEMENT_STATUS,
      determined: isPlacementDetermined(placement ?? null),
      editable: selectionStatus === PASSED_SELECTION_STATUS,
      companyName: placement?.companyName ?? null,
      placementDate: toDateOnly(placement?.placementDate ?? null),
      notes: placement?.notes ?? null
    }
  };
}

// src/services/admin/selectionPlacement.service.ts
function buildWhere4({ search, selectionStatus, placementStatus }) {
  return {
    ...selectionStatus ? { selectionStatuses: { some: { status: selectionStatus } } } : {},
    ...placementStatus ? { placementStatuses: { some: { status: placementStatus } } } : {},
    ...search ? {
      OR: [
        { registrationCode: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } }
      ]
    } : {}
  };
}
function resolveSelection(input, current) {
  if (input) return { status: input.status, notes: blankToNull(input.notes) };
  return { status: current?.status ?? DEFAULT_SELECTION_STATUS, notes: current?.notes ?? null };
}
function resolvePlacement(input, current) {
  if (input) {
    return {
      status: input.status,
      companyName: blankToNull(input.companyName),
      placementDate: blankToNull(input.placementDate),
      notes: blankToNull(input.notes)
    };
  }
  return {
    status: current?.status ?? DEFAULT_PLACEMENT_STATUS,
    companyName: current?.companyName ?? null,
    placementDate: current?.placementDate ?? null,
    notes: current?.notes ?? null
  };
}
async function saveSelection(tx, registrationId, current, next, adminId) {
  const evaluated = next.status !== DEFAULT_SELECTION_STATUS;
  const data = {
    status: next.status,
    notes: next.notes,
    evaluatedBy: evaluated ? adminId : null,
    evaluatedAt: evaluated ? /* @__PURE__ */ new Date() : null
  };
  if (current) await tx.selectionStatus.update({ where: { id: current.id }, data });
  else await tx.selectionStatus.create({ data: { registrationId, ...data } });
}
async function savePlacement(tx, registrationId, current, next) {
  if (current) await tx.placementStatus.update({ where: { id: current.id }, data: next });
  else await tx.placementStatus.create({ data: { registrationId, ...next } });
}
async function getSummary6() {
  const [totalParticipants, waitingSelection, passedSelection, placed] = await Promise.all([
    prisma_default.registration.count(),
    prisma_default.registration.count({ where: { selectionStatuses: { some: { status: "menunggu" } } } }),
    prisma_default.registration.count({ where: { selectionStatuses: { some: { status: "lolos" } } } }),
    prisma_default.registration.count({ where: { placementStatuses: { some: { status: "ditempatkan" } } } })
  ]);
  return { totalParticipants, waitingSelection, passedSelection, placed };
}
function getOptions3() {
  return {
    selectionStatuses: Object.values(RegistrationStatus),
    placementStatuses: Object.values(PlacementStage)
  };
}
async function listParticipants(filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildWhere4(filters2);
  const [total, registrations2] = await Promise.all([
    prisma_default.registration.count({ where }),
    prisma_default.registration.findMany({
      where,
      include: participantInclude,
      orderBy: { registrationDate: "desc" },
      skip,
      take
    })
  ]);
  return { items: registrations2.map(toParticipantItem), meta: buildPaginationMeta(total, page, limit) };
}
async function getParticipantById(id) {
  const registration = await prisma_default.registration.findUnique({ where: { id }, include: participantInclude });
  if (!registration) throw SelectionPlacementErrors.notFound();
  return toParticipantItem(registration);
}
async function updateParticipant(id, input, adminId) {
  if (!input.selection && !input.placement) throw SelectionPlacementErrors.nothingToUpdate();
  return prisma_default.$transaction(async (tx) => {
    const registration = await tx.registration.findUnique({ where: { id }, include: participantInclude });
    if (!registration) throw SelectionPlacementErrors.notFound();
    const [currentSelection] = registration.selectionStatuses;
    const [currentPlacement] = registration.placementStatuses;
    const selection = resolveSelection(input.selection, currentSelection);
    const placement = resolvePlacement(input.placement, currentPlacement);
    assertPlacementAllowed(selection.status, placement);
    if (input.selection) await saveSelection(tx, id, currentSelection, selection, adminId);
    if (input.placement) await savePlacement(tx, id, currentPlacement, placement);
    if (registration.userId) {
      const selectionChanged = input.selection && selection.status !== (currentSelection?.status ?? DEFAULT_SELECTION_STATUS);
      const placementChanged = input.placement && placement.status !== (currentPlacement?.status ?? DEFAULT_PLACEMENT_STATUS);
      if (selectionChanged) {
        await createNotification(tx, registration.userId, id, buildSelectionNotification(selection.status));
      }
      if (placementChanged) {
        await createNotification(tx, registration.userId, id, buildPlacementNotification(placement));
      }
    }
    const updated = await tx.registration.findUniqueOrThrow({ where: { id }, include: participantInclude });
    return toParticipantItem(updated);
  });
}

// src/controllers/admin/selectionPlacement.controller.ts
async function summary6(_req, res) {
  const data = await getSummary6();
  return res.json({ success: true, data });
}
function options3(_req, res) {
  return res.json({ success: true, data: getOptions3() });
}
async function index19(req, res) {
  const { items, meta } = await listParticipants(matchedData9(req));
  return res.json({ success: true, data: items, meta });
}
async function show16(req, res) {
  const { id } = matchedData9(req);
  const data = await getParticipantById(id);
  return res.json({ success: true, data });
}
async function update9(req, res) {
  const { id, ...input } = matchedData9(req);
  const data = await updateParticipant(id, input, req.user.userId);
  return res.json({ success: true, message: "Data seleksi dan penyaluran berhasil diperbarui", data });
}

// src/validators/selectionPlacement.validator.ts
import { body as body8 } from "express-validator";
var SELECTION_VALUES = Object.values(RegistrationStatus);
var PLACEMENT_VALUES = Object.values(PlacementStage);
var listParticipantsRules = [
  ...paginationRules,
  searchRule,
  enumQueryRule("selectionStatus", "Status seleksi", SELECTION_VALUES),
  enumQueryRule("placementStatus", "Status penyaluran", PLACEMENT_VALUES)
];
var participantIdRules = [idParamRule];
var updateParticipantRules = [
  idParamRule,
  body8("selection").optional().isObject().withMessage("selection harus berupa object"),
  body8("selection.status").if(body8("selection").exists()).isIn(SELECTION_VALUES).withMessage(`Status seleksi harus salah satu dari: ${SELECTION_VALUES.join(", ")}`),
  textRule("selection.notes", { label: "Catatan seleksi", max: SELECTION_PLACEMENT_LIMITS.notes, nullable: true }),
  body8("placement").optional().isObject().withMessage("placement harus berupa object"),
  body8("placement.status").if(body8("placement").exists()).isIn(PLACEMENT_VALUES).withMessage(`Status penyaluran harus salah satu dari: ${PLACEMENT_VALUES.join(", ")}`),
  textRule("placement.companyName", {
    label: "Nama perusahaan",
    max: SELECTION_PLACEMENT_LIMITS.companyName,
    nullable: true
  }),
  dateRule("placement.placementDate", { label: "Tanggal penempatan", nullable: true }),
  textRule("placement.notes", { label: "Catatan penyaluran", max: SELECTION_PLACEMENT_LIMITS.notes, nullable: true })
];

// src/routes/admin/selectionPlacement.routes.ts
var router25 = Router25();
router25.use(...superAdminAccess);
router25.get("/summary", summary6);
router25.get("/options", options3);
router25.get("/", validate(listParticipantsRules), index19);
router25.get("/:id", validate(participantIdRules), show16);
router25.put("/:id", validate(updateParticipantRules), update9);
var selectionPlacement_routes_default = router25;

// src/routes/admin/financialReport.routes.ts
import { Router as Router26 } from "express";

// src/controllers/admin/financialReport.controller.ts
import { matchedData as matchedData10 } from "express-validator";

// src/errors/financialReport.errors.ts
var FinancialReportErrors = {
  fileRequired: () => new AppError("FILE_REQUIRED", 400, "File Excel wajib dipilih", [{ field: "file", message: "File Excel wajib dipilih" }]),
  unreadableFile: () => new AppError("INVALID_SPREADSHEET", 400, "File tidak dapat dibaca, pastikan formatnya .xlsx yang valid"),
  emptySheet: () => new AppError("EMPTY_SPREADSHEET", 400, "File tidak berisi data untuk diimpor"),
  missingColumns: (columns) => new AppError("MISSING_COLUMNS", 400, `Kolom wajib tidak ditemukan: ${columns.join(", ")}`),
  tooManyRows: (max) => new AppError("TOO_MANY_ROWS", 400, `Jumlah baris melebihi batas maksimal ${max} baris per impor`),
  invalidDateRange: () => new AppError("INVALID_DATE_RANGE", 400, "Tanggal awal tidak boleh lebih besar dari tanggal akhir", [
    { field: "dateFrom", message: "Tanggal awal tidak boleh lebih besar dari tanggal akhir" }
  ]),
  tooManyExportRows: (max) => new AppError("EXPORT_TOO_LARGE", 400, `Data melebihi ${max} baris, persempit filter tanggal sebelum mengekspor`)
};

// src/services/admin/financialReport.excel.ts
import ExcelJS from "exceljs";
var JAKARTA_OFFSET_MS2 = 7 * 36e5;
var toExcelDate = (date) => new Date(date.getTime() + JAKARTA_OFFSET_MS2);
var normalizeHeader = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
function createWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Fitalenta";
  workbook.created = /* @__PURE__ */ new Date();
  const sheet = workbook.addWorksheet(REPORT_SHEET_NAME, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = REPORT_COLUMNS.map(({ key, header: header2, width }) => ({ key, header: header2, width }));
  const header = sheet.getRow(1);
  header.font = { bold: true };
  header.alignment = { vertical: "middle" };
  header.height = 20;
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: REPORT_HEADER_FILL } };
  });
  sheet.getColumn("amount").numFmt = "#,##0";
  sheet.getColumn("amountPaid").numFmt = "#,##0";
  sheet.getColumn("paymentDate").numFmt = "yyyy-mm-dd";
  sheet.getColumn("createdAt").numFmt = "yyyy-mm-dd hh:mm";
  sheet.getColumn("no").alignment = { horizontal: "center" };
  return { workbook, sheet };
}
function buildReportWorkbook(rows) {
  const { workbook, sheet } = createWorkbook();
  rows.forEach((row, index22) => {
    sheet.addRow({
      no: index22 + 1,
      invoiceNumber: row.invoiceNumber,
      receiptNumber: row.receiptNumber,
      participantName: row.participantName,
      email: row.email,
      program: row.program,
      amount: Number(row.amount),
      amountPaid: Number(row.amountPaid),
      status: PAYMENT_STATUS_LABELS[row.status],
      termin: row.termin.label,
      paymentMethod: PAYMENT_METHOD_LABELS[row.paymentMethod],
      paymentDate: row.paymentDate ? toExcelDate(row.paymentDate) : null,
      createdAt: toExcelDate(row.createdAt)
    });
  });
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: REPORT_COLUMNS.length } };
  return workbook;
}
var INSTRUCTIONS = [
  ["No", "Opsional, diabaikan saat impor."],
  ["Invoice Number", "Opsional. Jika sudah ada di sistem, data tagihan diperbarui. Jika kosong, nomor dibuat otomatis."],
  ["Receipt Number", "Opsional. Harus unik. Jika kosong pada tagihan yang sudah ada, nomor lama dipertahankan."],
  ["Nama Peserta", "Opsional, hanya sebagai referensi. Peserta dicocokkan lewat Email."],
  ["Email", "WAJIB. Email akun peserta yang sudah terdaftar."],
  ["Program", "WAJIB. Nama program persis seperti di sistem; peserta harus sudah mendaftar ke program tersebut."],
  ["Amount", "WAJIB. Total tagihan dalam rupiah, contoh: 16000000."],
  ["Amount Paid", "Opsional. Jumlah yang sudah dibayar. Default 0 untuk data baru."],
  ["Status", `Opsional. Pilihan: ${Object.values(PAYMENT_STATUS_LABELS).join(", ")}.`],
  [
    "Termin",
    'Opsional. Isi "Tunai" untuk pembayaran sekali bayar, atau "Cicilan 2" / "Cicilan 2/4" (cicilan ke-2 dari 4) untuk pembayaran bertahap. Harus sesuai dengan Status dan Amount Paid. Jika Status kosong, status Cicilan diturunkan dari Termin. Total termin hanya untuk keterangan dan tidak disimpan.'
  ],
  ["Payment Method", `Opsional. Pilihan: ${Object.values(PAYMENT_METHOD_LABELS).join(", ")}. Default Transfer.`],
  ["Payment Date", "Opsional. Format YYYY-MM-DD atau DD/MM/YYYY."],
  ["Created At", "Opsional. Tanggal tagihan dibuat; default hari impor. Tidak mengubah tagihan yang sudah ada."]
];
function buildTemplateWorkbook() {
  const { workbook, sheet } = createWorkbook();
  const statusList = `"${Object.values(PAYMENT_STATUS_LABELS).join(",")}"`;
  const methodList = `"${Object.values(PAYMENT_METHOD_LABELS).join(",")}"`;
  for (let row = 2; row <= IMPORT_LIMITS.maxRows + 1; row++) {
    sheet.getCell(row, REPORT_COLUMNS.findIndex((c) => c.key === "status") + 1).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [statusList]
    };
    sheet.getCell(row, REPORT_COLUMNS.findIndex((c) => c.key === "paymentMethod") + 1).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [methodList]
    };
  }
  const guide = workbook.addWorksheet(REPORT_INSTRUCTION_SHEET_NAME);
  guide.columns = [
    { header: "Kolom", key: "column", width: 20 },
    { header: "Keterangan", key: "note", width: 100 }
  ];
  guide.getRow(1).font = { bold: true };
  INSTRUCTIONS.forEach(([column, note]) => guide.addRow({ column, note }));
  guide.addRow({});
  guide.addRow({
    column: "Catatan",
    note: `Maksimal ${IMPORT_LIMITS.maxRows} baris per impor. Jika ada satu baris yang tidak valid, seluruh impor dibatalkan.`
  });
  return workbook;
}
function unwrapCell(value) {
  if (value === null || value === void 0) return null;
  if (value instanceof Date || typeof value === "number") return value;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "string") return value.trim() === "" ? null : value.trim();
  const object = value;
  if (Array.isArray(object.richText)) {
    const text = object.richText.map((part) => part.text ?? "").join("").trim();
    return text === "" ? null : text;
  }
  if ("result" in object) return unwrapCell(object.result);
  if ("text" in object) return unwrapCell(object.text);
  return null;
}
async function readImportSheet(buffer) {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer);
  } catch {
    throw FinancialReportErrors.unreadableFile();
  }
  const sheet = workbook.getWorksheet(REPORT_SHEET_NAME) ?? workbook.worksheets[0];
  if (!sheet) throw FinancialReportErrors.emptySheet();
  const columnIndex = /* @__PURE__ */ new Map();
  const headerByNormalized = new Map(REPORT_COLUMNS.map((column) => [normalizeHeader(column.header), column.key]));
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const text = unwrapCell(cell.value);
    const key = typeof text === "string" ? headerByNormalized.get(normalizeHeader(text)) : void 0;
    if (key && !columnIndex.has(key)) columnIndex.set(key, colNumber);
  });
  const missing = REPORT_REQUIRED_COLUMNS.filter((key) => !columnIndex.has(key));
  if (missing.length > 0) {
    throw FinancialReportErrors.missingColumns(
      missing.map((key) => REPORT_COLUMNS.find((column) => column.key === key).header)
    );
  }
  const rows = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    const cells = {};
    let hasData = false;
    for (const { key } of REPORT_COLUMNS) {
      const index22 = columnIndex.get(key);
      cells[key] = index22 ? unwrapCell(row.getCell(index22).value) : null;
      if (key !== "no" && cells[key] !== null) hasData = true;
    }
    if (!hasData) continue;
    rows.push({ rowNumber, cells });
    if (rows.length > IMPORT_LIMITS.maxRows) throw FinancialReportErrors.tooManyRows(IMPORT_LIMITS.maxRows);
  }
  if (rows.length === 0) throw FinancialReportErrors.emptySheet();
  return rows;
}

// src/services/admin/financialReport.termin.ts
var INSTALLMENT_STATUS = /^installment_(\d)$/;
var INSTALLMENT_STATUSES = Object.values(PaymentStatus).filter(
  (status) => INSTALLMENT_STATUS.test(status)
);
var installmentNumberOf = (status) => {
  const match = INSTALLMENT_STATUS.exec(status);
  return match ? Number(match[1]) : null;
};
function resolveTermin({ status, installmentAmounts, currentInstallmentNumber }) {
  const total = Array.isArray(installmentAmounts) && installmentAmounts.length > 0 ? installmentAmounts.length : null;
  const current = installmentNumberOf(status) ?? currentInstallmentNumber;
  if (total === null && current === 0) {
    return { type: "cash", current: null, total: null, label: TERMIN_TYPE_LABELS.cash };
  }
  const reached = status === "paid" && total !== null ? total : current;
  const base = total !== null ? `Cicilan ${reached}/${total}` : `Cicilan ${reached}`;
  const suffix = status === "paid" ? " (Lunas)" : status === "cancelled" ? " (Dibatalkan)" : "";
  return { type: "installment", current: reached, total, label: `${base}${suffix}` };
}
function terminWhere(type) {
  if (type === "installment") {
    return {
      OR: [
        { installmentAmounts: { not: prismaNamespace_exports.DbNull } },
        { status: { in: INSTALLMENT_STATUSES } },
        { currentInstallmentNumber: { gt: 0 } }
      ]
    };
  }
  return {
    AND: [
      { installmentAmounts: { equals: prismaNamespace_exports.DbNull } },
      { status: { notIn: INSTALLMENT_STATUSES } },
      { currentInstallmentNumber: 0 }
    ]
  };
}
var CASH_TERMIN = /^(tunai|cash|sekali\s*bayar|lunas\s*sekali\s*bayar)/i;
var INSTALLMENT_TERMIN = /^cicilan\s*(?:(\d+)\s*(?:\/\s*(\d+))?)?/i;
function parseTerminText(text) {
  const value = text.trim();
  if (CASH_TERMIN.test(value)) return { ok: true, value: { type: "cash", current: null, total: null } };
  const match = INSTALLMENT_TERMIN.exec(value);
  if (!match) {
    return { ok: false, message: 'Termin tidak dikenali, gunakan "Tunai", "Cicilan 2" atau "Cicilan 2/4"' };
  }
  const current = match[1] !== void 0 ? Number(match[1]) : null;
  const total = match[2] !== void 0 ? Number(match[2]) : null;
  const { installmentMin, installmentMax } = PAYMENT_LIMITS;
  if (total !== null && (total < installmentMin || total > installmentMax)) {
    return { ok: false, message: `Total termin harus antara ${installmentMin} dan ${installmentMax}` };
  }
  if (current !== null && (current > installmentMax || total !== null && current > total)) {
    return { ok: false, message: "Nomor cicilan tidak boleh melebihi total termin" };
  }
  return { ok: true, value: { type: "installment", current, total } };
}

// src/services/admin/financialReport.parsers.ts
var JAKARTA_OFFSET_MS3 = 7 * 36e5;
var TEXT_MAX_LENGTH = 100;
var normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
var blank = () => ({ ok: true, value: null });
var fail = (message) => ({ ok: false, message });
function buildLookup(labels, aliases = {}) {
  const lookup = /* @__PURE__ */ new Map();
  Object.entries(labels).forEach(([key, label]) => {
    lookup.set(normalize(key), key);
    lookup.set(normalize(label), key);
  });
  Object.entries(aliases).forEach(([alias, key]) => lookup.set(normalize(alias), key));
  return lookup;
}
var STATUS_LOOKUP = buildLookup(PAYMENT_STATUS_LABELS, { batal: "cancelled", terlambat: "overdue" });
var METHOD_LOOKUP = buildLookup(PAYMENT_METHOD_LABELS, { tf: "transfer", kredit: "credit_card" });
function parseText(cell, label, maxLength = TEXT_MAX_LENGTH) {
  if (cell === null) return blank();
  if (cell instanceof Date) return fail(`${label} harus berupa teks`);
  const text = String(cell).trim();
  if (text === "") return blank();
  if (text.length > maxLength) return fail(`${label} maksimal ${maxLength} karakter`);
  return { ok: true, value: text };
}
function parseStatus(cell) {
  if (cell === null) return blank();
  const status = typeof cell === "string" ? STATUS_LOOKUP.get(normalize(cell)) : void 0;
  if (!status) return fail(`Status tidak dikenali, gunakan salah satu: ${Object.values(PAYMENT_STATUS_LABELS).join(", ")}`);
  return { ok: true, value: status };
}
function parseTermin(cell) {
  if (cell === null) return blank();
  if (typeof cell !== "string") return fail('Termin harus berupa teks, contoh: "Tunai" atau "Cicilan 2/4"');
  const parsed = parseTerminText(cell);
  return parsed.ok ? { ok: true, value: parsed.value } : fail(parsed.message);
}
function parseMethod(cell) {
  if (cell === null) return blank();
  const method = typeof cell === "string" ? METHOD_LOOKUP.get(normalize(cell)) : void 0;
  if (!method) {
    return fail(`Metode pembayaran tidak dikenali, gunakan salah satu: ${Object.values(PAYMENT_METHOD_LABELS).join(", ")}`);
  }
  return { ok: true, value: method };
}
function parseNumberText(text) {
  const cleaned = text.replace(/rp/gi, "").replace(/\s/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) return Number(cleaned.replace(/\./g, "").replace(",", "."));
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) return Number(cleaned.replace(/,/g, ""));
  return Number(cleaned.replace(",", "."));
}
function parseMoney(cell, label) {
  if (cell === null) return blank();
  if (cell instanceof Date) return fail(`${label} harus berupa angka`);
  const value = typeof cell === "number" ? cell : parseNumberText(cell);
  if (!Number.isFinite(value)) return fail(`${label} harus berupa angka`);
  if (value < 0 || value > PAYMENT_LIMITS.amountMax) {
    return fail(`${label} harus antara 0 dan ${PAYMENT_LIMITS.amountMax.toLocaleString("id-ID")}`);
  }
  return { ok: true, value: Math.round(value * 100) / 100 };
}
var ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
var LOCAL_DATE = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
function fromWallClock(y, m, d, hh = 0, mm = 0, ss = 0) {
  const utc = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
  const valid = utc.getUTCFullYear() === y && utc.getUTCMonth() === m - 1 && utc.getUTCDate() === d && hh < 24 && mm < 60 && ss < 60;
  return valid ? new Date(utc.getTime() - JAKARTA_OFFSET_MS3) : null;
}
function parseDate(cell, label) {
  if (cell === null) return blank();
  if (cell instanceof Date) {
    return Number.isNaN(cell.getTime()) ? fail(`${label} tidak valid`) : { ok: true, value: new Date(cell.getTime() - JAKARTA_OFFSET_MS3) };
  }
  if (typeof cell === "string") {
    const iso = ISO_DATE.exec(cell);
    const local = iso ? null : LOCAL_DATE.exec(cell);
    const parts = iso ? [iso[1], iso[2], iso[3], iso[4], iso[5], iso[6]] : local ? [local[3], local[2], local[1], local[4], local[5], local[6]] : null;
    if (parts) {
      const [y, m, d, hh, mm, ss] = parts.map((part) => part === void 0 ? void 0 : Number(part));
      const date = fromWallClock(y, m, d, hh, mm, ss);
      if (date) return { ok: true, value: date };
    }
  }
  return fail(`${label} harus berformat YYYY-MM-DD atau DD/MM/YYYY`);
}
var normalizeName = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");

// src/services/admin/financialReport.import.ts
var Decimal6 = prismaNamespace_exports.Decimal;
var HEADER = Object.fromEntries(REPORT_COLUMNS.map(({ key, header }) => [key, header]));
var AMOUNT_CHANGED_LIMIT = new Decimal6(1e8);
var cents = (value) => Math.round(value * 100);
function parseRow(raw3, report) {
  const { rowNumber, cells } = raw3;
  let valid = true;
  const read = (field, parsed) => {
    if (parsed.ok) return parsed.value;
    report(rowNumber, field, parsed.message);
    valid = false;
    return null;
  };
  const required = (field, parsed) => {
    if (parsed.ok && parsed.value === null) {
      report(rowNumber, field, `${HEADER[field]} wajib diisi`);
      valid = false;
      return null;
    }
    return read(field, parsed);
  };
  const invoiceNumber = read("invoiceNumber", parseText(cells.invoiceNumber, HEADER.invoiceNumber));
  const receiptNumber = read("receiptNumber", parseText(cells.receiptNumber, HEADER.receiptNumber));
  const email = required("email", parseText(cells.email, HEADER.email, 191));
  const programName = required("program", parseText(cells.program, HEADER.program, 191));
  const amount = required("amount", parseMoney(cells.amount, HEADER.amount));
  const amountPaid = read("amountPaid", parseMoney(cells.amountPaid, HEADER.amountPaid));
  const status = read("status", parseStatus(cells.status));
  const termin = read("termin", parseTermin(cells.termin));
  const paymentMethod = read("paymentMethod", parseMethod(cells.paymentMethod));
  const paymentDate = read("paymentDate", parseDate(cells.paymentDate, HEADER.paymentDate));
  const createdAt = read("createdAt", parseDate(cells.createdAt, HEADER.createdAt));
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    report(rowNumber, "email", "Format email tidak valid");
    valid = false;
  }
  if (amount !== null && amount <= 0) {
    report(rowNumber, "amount", "Amount harus lebih dari 0");
    valid = false;
  }
  if (!valid || !email || !programName || amount === null) return null;
  return { rowNumber, invoiceNumber, receiptNumber, email, programName, amount, amountPaid, status, termin, paymentMethod, paymentDate, createdAt };
}
function statusFromTermin(termin, amount, amountPaid) {
  if (termin?.type !== "installment" || !termin.current) return null;
  if (cents(amountPaid) >= cents(amount)) return "paid";
  if (cents(amountPaid) > 0) return `installment_${termin.current}`;
  return null;
}
function checkTermin(termin, status, hasInstallmentPlan) {
  const label = PAYMENT_STATUS_LABELS[status];
  const statusNumber = installmentNumberOf(status);
  if (termin.type === "cash") {
    if (statusNumber) return `Termin Tunai tidak sesuai dengan status ${label}`;
    if (hasInstallmentPlan) return "Tagihan ini memakai skema cicilan, Termin tidak boleh Tunai";
    return null;
  }
  if (status === "pending" && termin.current) return `Termin Cicilan ${termin.current} tetapi status ${label}`;
  if (statusNumber && termin.current !== null && termin.current !== statusNumber) {
    return `Termin Cicilan ${termin.current} tidak sesuai dengan status ${label}`;
  }
  if (status === "paid" && termin.total !== null && termin.current !== null && termin.current !== termin.total) {
    return `Status ${label} mensyaratkan cicilan terakhir (${termin.total}/${termin.total})`;
  }
  return null;
}
function checkConsistency(status, amount, amountPaid) {
  const label = PAYMENT_STATUS_LABELS[status];
  if (cents(amountPaid) > cents(amount)) return "Amount Paid tidak boleh melebihi Amount";
  if (status === "paid" && cents(amountPaid) !== cents(amount)) {
    return `Status ${label} mensyaratkan Amount Paid sama dengan Amount`;
  }
  if (status === "pending" && amountPaid > 0) return `Status ${label} tetapi Amount Paid lebih dari 0`;
  if (installmentNumberOf(status) !== null && (amountPaid <= 0 || cents(amountPaid) >= cents(amount))) {
    return `Status ${label} mensyaratkan Amount Paid lebih dari 0 dan kurang dari Amount`;
  }
  return null;
}
async function planWrites(rows, report) {
  const emails = [...new Set(rows.map((row) => row.email.toLowerCase()))];
  const invoiceNumbers = rows.flatMap((row) => row.invoiceNumber ? [row.invoiceNumber] : []);
  const receiptNumbers = rows.flatMap((row) => row.receiptNumber ? [row.receiptNumber] : []);
  const [registrations2, payments, receiptOwners] = await Promise.all([
    prisma_default.registration.findMany({
      where: { user: { email: { in: emails } } },
      select: { id: true, user: { select: { email: true } }, program: { select: { name: true } } }
    }),
    prisma_default.payment.findMany({
      where: { invoiceNumber: { in: invoiceNumbers } },
      select: {
        id: true,
        invoiceNumber: true,
        registrationId: true,
        status: true,
        amountPaid: true,
        installmentAmounts: true
      }
    }),
    prisma_default.payment.findMany({
      where: { receiptNumber: { in: receiptNumbers } },
      select: { invoiceNumber: true, receiptNumber: true }
    })
  ]);
  const registrationIds = /* @__PURE__ */ new Map();
  for (const { id, user, program } of registrations2) {
    if (user && program) registrationIds.set(`${user.email.toLowerCase()}|${normalizeName(program.name)}`, id);
  }
  const existingByInvoice = new Map(payments.map((payment) => [payment.invoiceNumber, payment]));
  const invoiceByReceipt = new Map(receiptOwners.map((payment) => [payment.receiptNumber, payment.invoiceNumber]));
  const seenInvoices = /* @__PURE__ */ new Map();
  const seenReceipts = /* @__PURE__ */ new Map();
  const plan = [];
  for (const row of rows) {
    const problems = { count: 0 };
    const fail2 = (field, message) => {
      problems.count++;
      report(row.rowNumber, field, message);
    };
    if (row.invoiceNumber) {
      const firstRow = seenInvoices.get(row.invoiceNumber);
      if (firstRow) fail2("invoiceNumber", `Invoice ${row.invoiceNumber} muncul ganda (sudah ada di baris ${firstRow})`);
      seenInvoices.set(row.invoiceNumber, firstRow ?? row.rowNumber);
    }
    if (row.receiptNumber) {
      const firstRow = seenReceipts.get(row.receiptNumber);
      if (firstRow) fail2("receiptNumber", `Receipt ${row.receiptNumber} muncul ganda (sudah ada di baris ${firstRow})`);
      seenReceipts.set(row.receiptNumber, firstRow ?? row.rowNumber);
      const owner = invoiceByReceipt.get(row.receiptNumber);
      if (owner !== void 0 && owner !== row.invoiceNumber) {
        fail2("receiptNumber", `Receipt ${row.receiptNumber} sudah dipakai oleh invoice ${owner}`);
      }
    }
    const registrationId = registrationIds.get(`${row.email.toLowerCase()}|${normalizeName(row.programName)}`);
    if (!registrationId) {
      fail2("email", `Peserta ${row.email} belum terdaftar pada program "${row.programName}"`);
      continue;
    }
    const existing = row.invoiceNumber ? existingByInvoice.get(row.invoiceNumber) : void 0;
    if (existing && existing.registrationId !== registrationId) {
      fail2("invoiceNumber", `Invoice ${existing.invoiceNumber} milik peserta atau program lain`);
    }
    const amountPaid = row.amountPaid ?? (existing ? Number(existing.amountPaid.toString()) : 0);
    let status = row.status ?? statusFromTermin(row.termin, row.amount, amountPaid) ?? existing?.status ?? null;
    if (!status) {
      if (cents(amountPaid) === 0) status = "pending";
      else if (cents(amountPaid) >= cents(row.amount)) status = "paid";
      else fail2("status", "Status wajib diisi untuk pembayaran sebagian (mis. Cicilan 1)");
    }
    if (status) {
      const problem = checkConsistency(status, row.amount, amountPaid);
      if (problem) fail2("amountPaid", problem);
      if (row.termin) {
        const plan2 = existing?.installmentAmounts;
        const hasPlan = Array.isArray(plan2) && plan2.length > 0;
        const terminProblem = checkTermin(row.termin, status, hasPlan);
        if (terminProblem) fail2("termin", terminProblem);
      }
    }
    if (problems.count > 0 || !status) continue;
    plan.push({
      row,
      registrationId,
      paymentId: existing?.id ?? null,
      previous: existing ? { status: existing.status, amountPaid: existing.amountPaid } : null,
      status,
      amountPaid
    });
  }
  return plan;
}
async function applyWrites(plan, adminId) {
  const execute = () => prisma_default.$transaction(
    async (tx) => {
      let created = 0;
      let updated = 0;
      for (const { row, registrationId, paymentId, previous, status, amountPaid } of plan) {
        const installmentNo = installmentNumberOf(status) ?? (row.termin?.type === "installment" ? row.termin.current : null);
        const change2 = new Decimal6(amountPaid).minus(previous?.amountPaid ?? 0);
        const safeChange = change2.abs().lt(AMOUNT_CHANGED_LIMIT) ? change2 : null;
        let targetId;
        if (paymentId === null) {
          const issuedAt = row.createdAt ?? /* @__PURE__ */ new Date();
          const payment = await tx.payment.create({
            data: {
              registrationId,
              invoiceNumber: row.invoiceNumber ?? await nextInvoiceNumber(tx, issuedAt),
              receiptNumber: row.receiptNumber,
              amount: row.amount,
              amountPaid,
              status,
              paymentMethod: row.paymentMethod ?? "transfer",
              paymentDate: row.paymentDate,
              currentInstallmentNumber: installmentNo ?? 0,
              isManualInvoice: true,
              issuedAt,
              ...row.createdAt ? { createdAt: row.createdAt } : {}
            }
          });
          targetId = payment.id;
          created++;
        } else {
          await tx.payment.update({
            where: { id: paymentId },
            data: {
              amount: row.amount,
              amountPaid,
              status,
              ...row.paymentMethod ? { paymentMethod: row.paymentMethod } : {},
              ...row.paymentDate ? { paymentDate: row.paymentDate } : {},
              ...row.receiptNumber ? { receiptNumber: row.receiptNumber } : {},
              ...installmentNo ? { currentInstallmentNumber: installmentNo } : {}
            }
          });
          targetId = paymentId;
          updated++;
        }
        await tx.paymentHistory.create({
          data: {
            paymentId: targetId,
            oldStatus: previous?.status ?? null,
            newStatus: status,
            oldAmountPaid: previous?.amountPaid ?? null,
            newAmountPaid: amountPaid,
            amountChanged: safeChange,
            notes: IMPORT_HISTORY_NOTE,
            changedBy: adminId
          }
        });
      }
      return { created, updated };
    },
    { timeout: IMPORT_LIMITS.transactionTimeoutMs, maxWait: 1e4 }
  );
  return retryOnUnique(execute, { onExhausted: PaymentErrors.codeGenerationFailed });
}
async function importReport(buffer, adminId, dryRun) {
  const rawRows = await readImportSheet(buffer);
  const errors = [];
  const report = (row, field, message) => errors.push({ row, field: field ? HEADER[field] : null, message });
  const parsed = rawRows.flatMap((raw3) => parseRow(raw3, report) ?? []);
  const plan = await planWrites(parsed, report);
  const toUpdate = plan.filter((item) => item.paymentId !== null).length;
  const base = {
    dryRun,
    totalRows: rawRows.length,
    toCreate: plan.length - toUpdate,
    toUpdate,
    errorCount: errors.length,
    errors: errors.sort((a, b) => a.row - b.row).slice(0, IMPORT_LIMITS.maxReturnedErrors)
  };
  if (dryRun || errors.length > 0) return { ...base, committed: false, created: 0, updated: 0 };
  const { created, updated } = await applyWrites(plan, adminId);
  return { ...base, committed: true, created, updated };
}

// src/services/admin/financialReport.service.ts
var JAKARTA_OFFSET_MS4 = 7 * 36e5;
var DAY_MS = 864e5;
var reportInclude = {
  registration: {
    select: {
      user: { select: { name: true, email: true } },
      program: { select: { name: true } }
    }
  }
};
function toReportRow(payment) {
  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    receiptNumber: payment.receiptNumber,
    participantName: payment.registration?.user?.name ?? "",
    email: payment.registration?.user?.email ?? "",
    program: payment.registration?.program?.name ?? "",
    amount: payment.amount.toString(),
    amountPaid: payment.amountPaid.toString(),
    status: payment.status,
    termin: resolveTermin(payment),
    paymentMethod: payment.paymentMethod,
    paymentDate: payment.paymentDate,
    createdAt: payment.createdAt
  };
}
function assertDateRange2({ dateFrom, dateTo }) {
  if (dateFrom && dateTo && dateFrom > dateTo) throw FinancialReportErrors.invalidDateRange();
}
function buildWhere5(filters2) {
  const { search, status, termin, paymentMethod, dateFrom, dateTo } = filters2;
  const createdAt = {};
  if (dateFrom) createdAt.gte = new Date(dateFrom.getTime() - JAKARTA_OFFSET_MS4);
  if (dateTo) createdAt.lt = new Date(dateTo.getTime() + DAY_MS - JAKARTA_OFFSET_MS4);
  return {
    issuedAt: { not: null },
    ...status ? { status } : {},
    ...termin ? { AND: [terminWhere(termin)] } : {},
    ...paymentMethod ? { paymentMethod } : {},
    ...dateFrom || dateTo ? { createdAt } : {},
    ...search ? {
      OR: [
        { invoiceNumber: { contains: search } },
        { receiptNumber: { contains: search } },
        { registration: { registrationCode: { contains: search } } },
        { registration: { user: { name: { contains: search } } } },
        { registration: { user: { email: { contains: search } } } },
        { registration: { program: { name: { contains: search } } } }
      ]
    } : {}
  };
}
var orderBy = [{ createdAt: "desc" }, { id: "desc" }];
async function listReport(filters2) {
  assertDateRange2(filters2);
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildWhere5(filters2);
  const [total, payments] = await Promise.all([
    prisma_default.payment.count({ where }),
    prisma_default.payment.findMany({ where, include: reportInclude, orderBy, skip, take })
  ]);
  return { items: payments.map(toReportRow), meta: buildPaginationMeta(total, page, limit) };
}
async function getReportSummary(filters2) {
  assertDateRange2(filters2);
  const where = buildWhere5(filters2);
  const active = { AND: [where, { status: { not: "cancelled" } }] };
  const [totalRecords, paidCount, cashCount, installmentCount, all, billable] = await Promise.all([
    prisma_default.payment.count({ where }),
    prisma_default.payment.count({ where: { AND: [where, { status: "paid" }] } }),
    prisma_default.payment.count({ where: { AND: [where, terminWhere("cash")] } }),
    prisma_default.payment.count({ where: { AND: [where, terminWhere("installment")] } }),
    prisma_default.payment.aggregate({ where, _sum: { amountPaid: true } }),
    prisma_default.payment.aggregate({ where: active, _sum: { amount: true, amountPaid: true } })
  ]);
  const totalBilled = new prismaNamespace_exports.Decimal(billable._sum.amount ?? 0);
  const billablePaid = new prismaNamespace_exports.Decimal(billable._sum.amountPaid ?? 0);
  return {
    totalRecords,
    paidCount,
    cashCount,
    installmentCount,
    totalBilled: totalBilled.toString(),
    totalCollected: new prismaNamespace_exports.Decimal(all._sum.amountPaid ?? 0).toString(),
    totalOutstanding: totalBilled.minus(billablePaid).toString()
  };
}
async function listReportForExport(filters2) {
  assertDateRange2(filters2);
  const where = buildWhere5(filters2);
  const total = await prisma_default.payment.count({ where });
  if (total > EXPORT_MAX_ROWS) throw FinancialReportErrors.tooManyExportRows(EXPORT_MAX_ROWS);
  const payments = await prisma_default.payment.findMany({ where, include: reportInclude, orderBy });
  return payments.map(toReportRow);
}

// src/controllers/admin/financialReport.controller.ts
var JAKARTA_OFFSET_MS5 = 7 * 36e5;
var todayStamp = () => new Date(Date.now() + JAKARTA_OFFSET_MS5).toISOString().slice(0, 10).replace(/-/g, "");
async function sendWorkbook(res, filename, workbook) {
  res.setHeader("Content-Type", XLSX_MIME);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "private, no-store");
  await workbook.xlsx.write(res);
  res.end();
}
async function index20(req, res) {
  const { items, meta } = await listReport(matchedData10(req));
  return res.json({ success: true, data: items, meta });
}
async function summary7(req, res) {
  const data = await getReportSummary(matchedData10(req));
  return res.json({ success: true, data });
}
async function exportXlsx(req, res) {
  const rows = await listReportForExport(matchedData10(req));
  return sendWorkbook(res, `laporan-keuangan-${todayStamp()}.xlsx`, buildReportWorkbook(rows));
}
async function template(_req, res) {
  return sendWorkbook(res, "template-laporan-keuangan-fitalenta.xlsx", buildTemplateWorkbook());
}
async function importXlsx(req, res) {
  if (!req.file) throw FinancialReportErrors.fileRequired();
  const { dryRun = false } = matchedData10(req);
  const data = await importReport(req.file.buffer, req.user.userId, dryRun);
  const message = dryRun ? "Pemeriksaan file selesai" : data.committed ? "Impor laporan keuangan berhasil" : "Impor dibatalkan karena ada data yang tidak valid";
  return res.json({ success: true, message, data });
}

// src/validators/financialReport.validator.ts
import { query as query6 } from "express-validator";
var dateQueryRule = (field, label) => query6(field).optional({ values: "falsy" }).isISO8601({ strict: true, strictSeparator: true }).withMessage(`${label} harus berformat YYYY-MM-DD`).toDate();
var reportFilterRules = [
  searchRule,
  enumQueryRule("status", "Status pembayaran", Object.values(PaymentStatus)),
  enumQueryRule("termin", "Termin pembayaran", [...TERMIN_TYPES]),
  enumQueryRule("paymentMethod", "Metode pembayaran", Object.values(PaymentMethod)),
  dateQueryRule("dateFrom", "Tanggal awal"),
  dateQueryRule("dateTo", "Tanggal akhir")
];
var listReportRules = [...paginationRules, ...reportFilterRules];
var importReportRules = [
  query6("dryRun").optional({ values: "falsy" }).isBoolean().withMessage("dryRun harus true atau false").toBoolean()
];

// src/routes/admin/financialReport.routes.ts
var router26 = Router26();
router26.use(...superAdminAccess);
router26.get("/", validate(listReportRules), index20);
router26.get("/summary", validate(reportFilterRules), summary7);
router26.get("/export", validate(reportFilterRules), exportXlsx);
router26.get("/template", template);
router26.post(
  "/import",
  uploadReportSpreadsheet.single("file"),
  validate(importReportRules),
  importXlsx
);
var financialReport_routes_default = router26;

// src/routes/admin/cms.routes.ts
import { Router as Router27 } from "express";

// src/config/cms.config.ts
var CMS_SUMMARY_KEYS = [
  "articles",
  "events",
  "services",
  "gallery",
  "teamMembers",
  "testimonials"
];

// src/services/admin/cms.service.ts
var COUNTERS = {
  articles: () => prisma_default.article.count(),
  events: () => prisma_default.event.count(),
  services: () => prisma_default.service.count(),
  gallery: () => prisma_default.gallery.count(),
  teamMembers: () => prisma_default.teamMember.count(),
  testimonials: () => prisma_default.testimonial.count()
};
async function getSummary7() {
  const counts = await Promise.all(CMS_SUMMARY_KEYS.map((key) => COUNTERS[key]()));
  return Object.fromEntries(CMS_SUMMARY_KEYS.map((key, index22) => [key, counts[index22]]));
}

// src/controllers/admin/cms.controller.ts
async function summary8(_req, res) {
  const data = await getSummary7();
  return res.json({ success: true, data });
}

// src/routes/admin/cms.routes.ts
var router27 = Router27();
router27.use(...cmsAccess);
router27.get("/summary", summary8);
var cms_routes_default = router27;

// src/routes/admin/programCategory.routes.ts
import { Router as Router28 } from "express";

// src/controllers/admin/programCategory.controller.ts
import { matchedData as matchedData11 } from "express-validator";

// src/errors/programCategory.errors.ts
var ProgramCategoryErrors = {
  notFound: () => new AppError("PROGRAM_CATEGORY_NOT_FOUND", 404, "Kategori program tidak ditemukan"),
  nameAlreadyExists: () => new AppError("VALIDATION_ERROR", 400, "Data yang dikirim tidak valid", [
    { field: "name", message: "Nama kategori sudah digunakan" }
  ]),
  hasPrograms: () => new AppError(
    "PROGRAM_CATEGORY_HAS_PROGRAMS",
    409,
    "Kategori tidak dapat dihapus karena masih memiliki program yang terkait"
  )
};

// src/services/admin/programCategory.service.ts
var ORDER_BY3 = [{ name: "asc" }];
var SELECT = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  _count: { select: { programs: true } }
};
function toItem(raw3) {
  return {
    id: raw3.id,
    name: raw3.name,
    description: raw3.description,
    programCount: raw3._count.programs,
    createdAt: raw3.createdAt
  };
}
function buildWhere6({ search }) {
  return search ? { name: { contains: search } } : {};
}
async function findOrFail3(id) {
  const category = await prisma_default.programCategory.findUnique({
    where: { id },
    select: { ...SELECT }
  });
  if (!category) throw ProgramCategoryErrors.notFound();
  return category;
}
async function assertNameUnique(name, excludeId) {
  const existing = await prisma_default.programCategory.findFirst({
    where: {
      name: { equals: name },
      ...excludeId ? { id: { not: excludeId } } : {}
    },
    select: { id: true }
  });
  if (existing) throw ProgramCategoryErrors.nameAlreadyExists();
}
async function listProgramCategories(filters2) {
  const { page, limit, skip, take } = resolvePagination(filters2);
  const where = buildWhere6(filters2);
  const [total, categories] = await Promise.all([
    prisma_default.programCategory.count({ where }),
    prisma_default.programCategory.findMany({ where, select: SELECT, orderBy: ORDER_BY3, skip, take })
  ]);
  return { items: categories.map(toItem), meta: buildPaginationMeta(total, page, limit) };
}
async function getProgramCategoryById(id) {
  return toItem(await findOrFail3(id));
}
async function createProgramCategory(input) {
  await assertNameUnique(input.name);
  const category = await prisma_default.programCategory.create({
    data: {
      name: input.name,
      description: input.description ?? null
    },
    select: SELECT
  });
  return toItem(category);
}
async function updateProgramCategory(id, input) {
  await findOrFail3(id);
  if (input.name) {
    await assertNameUnique(input.name, id);
  }
  const data = {};
  if (input.name !== void 0) data.name = input.name;
  if (input.description !== void 0) data.description = input.description || null;
  const category = await prisma_default.programCategory.update({
    where: { id },
    data,
    select: SELECT
  });
  return toItem(category);
}
async function deleteProgramCategory(id) {
  const category = await findOrFail3(id);
  if (category._count.programs > 0) throw ProgramCategoryErrors.hasPrograms();
  await prisma_default.programCategory.delete({ where: { id } });
}

// src/controllers/admin/programCategory.controller.ts
async function index21(req, res) {
  const { items, meta } = await listProgramCategories(
    matchedData11(req)
  );
  return res.json({ success: true, data: items, meta });
}
async function show17(req, res) {
  const { id } = matchedData11(req);
  const data = await getProgramCategoryById(id);
  return res.json({ success: true, data });
}
async function store10(req, res) {
  const data = await createProgramCategory(matchedData11(req));
  return res.status(201).json({ success: true, message: "Kategori program berhasil dibuat", data });
}
async function update10(req, res) {
  const { id, ...input } = matchedData11(req);
  const data = await updateProgramCategory(id, input);
  return res.json({ success: true, message: "Kategori program berhasil diperbarui", data });
}
async function destroy8(req, res) {
  const { id } = matchedData11(req);
  await deleteProgramCategory(id);
  return res.json({ success: true, message: "Kategori program berhasil dihapus" });
}

// src/validators/programCategory.validator.ts
var NAME_MAX = 100;
var DESC_MAX = 500;
function programCategoryFieldRules(partial) {
  return [
    textRule("name", { label: "Nama kategori", max: NAME_MAX, optional: partial }),
    textRule("description", { label: "Deskripsi", max: DESC_MAX, nullable: true })
  ];
}
var listProgramCategoryRules = [...paginationRules, searchRule];
var programCategoryIdRules = [idParamRule];
var createProgramCategoryRules = programCategoryFieldRules(false);
var updateProgramCategoryRules = [idParamRule, ...programCategoryFieldRules(true)];

// src/routes/admin/programCategory.routes.ts
var router28 = Router28();
router28.use(...superAdminAccess);
router28.get("/", validate(listProgramCategoryRules), index21);
router28.post("/", validate(createProgramCategoryRules), store10);
router28.get("/:id", validate(programCategoryIdRules), show17);
router28.put("/:id", validate(updateProgramCategoryRules), update10);
router28.delete("/:id", validate(programCategoryIdRules), destroy8);
var programCategory_routes_default = router28;

// src/routes/admin/participant.routes.ts
import { Router as Router29 } from "express";

// src/controllers/admin/participant.controller.ts
import { matchedData as matchedData12 } from "express-validator";

// src/config/participant.config.ts
var PARTICIPANT_SHEET_NAME = "Data Peserta";
var PARTICIPANT_INSTRUCTION_SHEET_NAME = "Panduan Import";
var PARTICIPANT_HEADER_FILL = "FF1B4F72";
var XLSX_MIME2 = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var PARTICIPANT_COLUMNS = [
  { key: "no", header: "No", width: 5 },
  { key: "registrationCode", header: "Kode Registrasi", width: 20 },
  { key: "registrationDate", header: "Tgl Registrasi", width: 18 },
  { key: "registrationStatus", header: "Status Registrasi", width: 18 },
  { key: "fullName", header: "Nama Lengkap", width: 30 },
  { key: "email", header: "Email", width: 30 },
  { key: "phone", header: "No. HP", width: 18 },
  { key: "nik", header: "NIK", width: 20 },
  { key: "gender", header: "Jenis Kelamin", width: 15 },
  { key: "birthPlace", header: "Tempat Lahir", width: 20 },
  { key: "birthDate", header: "Tgl Lahir", width: 15 },
  { key: "lastEducation", header: "Pendidikan Terakhir", width: 22 },
  { key: "major", header: "Jurusan", width: 22 },
  { key: "educationInstitution", header: "Institusi Pendidikan", width: 28 },
  { key: "currentActivity", header: "Aktivitas Saat Ini", width: 22 },
  { key: "maritalStatus", header: "Status Pernikahan", width: 18 },
  { key: "parentPhone", header: "No. HP Orang Tua", width: 20 },
  { key: "parentRelationship", header: "Hub. Orang Tua", width: 18 },
  { key: "ktpProvinceName", header: "Provinsi KTP", width: 22 },
  { key: "ktpCityName", header: "Kota/Kab KTP", width: 22 },
  { key: "ktpAddress", header: "Alamat KTP", width: 40 },
  { key: "domicileProvinceName", header: "Provinsi Domisili", width: 22 },
  { key: "domicileCityName", header: "Kota/Kab Domisili", width: 22 },
  { key: "domicileAddress", header: "Alamat Domisili", width: 40 },
  { key: "programName", header: "Program", width: 30 },
  { key: "programFormat", header: "Format Program", width: 18 },
  { key: "selectionStatus", header: "Status Seleksi", width: 18 },
  { key: "placementStatus", header: "Status Penempatan", width: 20 },
  { key: "companyName", header: "Nama Perusahaan", width: 28 },
  { key: "placementDate", header: "Tgl Penempatan", width: 18 },
  { key: "paymentStatus", header: "Status Pembayaran", width: 20 },
  { key: "amountPaid", header: "Jumlah Dibayar", width: 20 }
];
var PARTICIPANT_REQUIRED_COLUMNS = ["email", "programName"];
var GENDER_LABELS = {
  L: "Laki-laki",
  P: "Perempuan"
};
var REGISTRATION_STATUS_LABELS = {
  menunggu: "Menunggu",
  lolos: "Lolos",
  tidak_lolos: "Tidak Lolos"
};
var SELECTION_STATUS_LABELS = {
  menunggu: "Menunggu",
  lolos: "Lolos",
  tidak_lolos: "Tidak Lolos"
};
var PLACEMENT_STATUS_LABELS = {
  proses: "Proses",
  lolos: "Lolos",
  ditempatkan: "Ditempatkan"
};
var PAYMENT_STATUS_LABELS_PARTICIPANT = {
  pending: "Pending",
  installment_1: "Cicilan 1",
  installment_2: "Cicilan 2",
  installment_3: "Cicilan 3",
  installment_4: "Cicilan 4",
  installment_5: "Cicilan 5",
  installment_6: "Cicilan 6",
  paid: "Lunas",
  overdue: "Jatuh Tempo",
  cancelled: "Dibatalkan"
};
var IMPORT_PARTICIPANT_LIMITS = {
  maxRows: 500
};

// src/services/admin/participant.excel.ts
import ExcelJS2 from "exceljs";
var JAKARTA_OFFSET_MS6 = 7 * 36e5;
function toExcelDate2(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getTime() + JAKARTA_OFFSET_MS6);
}
function createParticipantWorkbook() {
  const workbook = new ExcelJS2.Workbook();
  workbook.creator = "Fitalenta";
  workbook.created = /* @__PURE__ */ new Date();
  const sheet = workbook.addWorksheet(PARTICIPANT_SHEET_NAME, {
    views: [{ state: "frozen", ySplit: 1 }]
  });
  sheet.columns = PARTICIPANT_COLUMNS.map(({ key, header: header2, width }) => ({ key, header: header2, width }));
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  header.height = 30;
  header.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: PARTICIPANT_HEADER_FILL }
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });
  sheet.getColumn("registrationDate").numFmt = "yyyy-mm-dd hh:mm";
  sheet.getColumn("birthDate").numFmt = "yyyy-mm-dd";
  sheet.getColumn("placementDate").numFmt = "yyyy-mm-dd";
  sheet.getColumn("amountPaid").numFmt = "#,##0";
  sheet.getColumn("no").alignment = { horizontal: "center" };
  return { workbook, sheet };
}
function buildParticipantWorkbook(rows) {
  const { workbook, sheet } = createParticipantWorkbook();
  rows.forEach((row, index22) => {
    sheet.addRow({
      no: index22 + 1,
      registrationCode: row.registrationCode,
      registrationDate: row.registrationDate ? toExcelDate2(row.registrationDate) : null,
      registrationStatus: REGISTRATION_STATUS_LABELS[row.registrationStatus] ?? row.registrationStatus,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      nik: row.nik,
      gender: row.gender ? GENDER_LABELS[row.gender] ?? row.gender : null,
      birthPlace: row.birthPlace,
      birthDate: row.birthDate ? toExcelDate2(row.birthDate) : null,
      lastEducation: row.lastEducation,
      major: row.major,
      educationInstitution: row.educationInstitution,
      currentActivity: row.currentActivity,
      maritalStatus: row.maritalStatus,
      parentPhone: row.parentPhone,
      parentRelationship: row.parentRelationship,
      ktpProvinceName: row.ktpProvinceName,
      ktpCityName: row.ktpCityName,
      ktpAddress: row.ktpAddress,
      domicileProvinceName: row.domicileProvinceName,
      domicileCityName: row.domicileCityName,
      domicileAddress: row.domicileAddress,
      programName: row.programName,
      programFormat: row.programFormat,
      selectionStatus: row.selectionStatus ? SELECTION_STATUS_LABELS[row.selectionStatus] ?? row.selectionStatus : null,
      placementStatus: row.placementStatus ? PLACEMENT_STATUS_LABELS[row.placementStatus] ?? row.placementStatus : null,
      companyName: row.companyName,
      placementDate: row.placementDate ? toExcelDate2(row.placementDate) : null,
      paymentStatus: row.paymentStatus ? PAYMENT_STATUS_LABELS_PARTICIPANT[row.paymentStatus] ?? row.paymentStatus : null,
      amountPaid: row.amountPaid && !isNaN(Number(row.amountPaid)) ? Number(row.amountPaid) : null
    });
  });
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: PARTICIPANT_COLUMNS.length }
  };
  return workbook;
}
var PARTICIPANT_INSTRUCTIONS = [
  ["No", "Opsional, diabaikan saat impor."],
  ["Kode Registrasi", "Otomatis dibuat sistem. Diabaikan saat impor."],
  ["Tgl Registrasi", "Otomatis. Diabaikan saat impor."],
  ["Status Registrasi", "Otomatis. Diabaikan saat impor."],
  ["Nama Lengkap", "WAJIB. Nama lengkap peserta."],
  ["Email", "WAJIB. Email akun peserta yang terdaftar di sistem."],
  ["No. HP", "Opsional. Format: 081234567890 atau +628..."],
  ["NIK", "Opsional. 16 digit angka tanpa spasi."],
  ["Jenis Kelamin", "Opsional. Isi: L (Laki-laki) atau P (Perempuan)."],
  ["Tempat Lahir", "Opsional. Kota tempat lahir."],
  ["Tgl Lahir", "Opsional. Format: YYYY-MM-DD."],
  ["Pendidikan Terakhir", "Opsional. Contoh: SMA, D3, S1, S2."],
  ["Jurusan", "Opsional. Jurusan pendidikan terakhir."],
  ["Institusi Pendidikan", "Opsional. Nama sekolah/universitas."],
  ["Aktivitas Saat Ini", "Opsional. Contoh: Mahasiswa, Bekerja, dll."],
  ["Status Pernikahan", "Opsional. Contoh: Belum Menikah, Menikah."],
  ["No. HP Orang Tua", "Opsional. Format nomor HP."],
  ["Hub. Orang Tua", "Opsional. Contoh: Ayah, Ibu, Wali."],
  ["Provinsi KTP", "Opsional. Nama provinsi sesuai KTP."],
  ["Kota/Kab KTP", "Opsional. Nama kota/kabupaten sesuai KTP."],
  ["Alamat KTP", "Opsional. Alamat lengkap sesuai KTP."],
  ["Provinsi Domisili", "Opsional. Nama provinsi tempat tinggal saat ini."],
  ["Kota/Kab Domisili", "Opsional. Nama kota/kabupaten tempat tinggal."],
  ["Alamat Domisili", "Opsional. Alamat lengkap tempat tinggal saat ini."],
  ["Program", "WAJIB. Nama program persis seperti di sistem."],
  ["Format Program", "Otomatis diisi dari data program."],
  ["Status Seleksi", "Otomatis. Tidak diproses saat impor."],
  ["Status Penempatan", "Otomatis. Tidak diproses saat impor."],
  ["Nama Perusahaan", "Otomatis. Tidak diproses saat impor."],
  ["Tgl Penempatan", "Otomatis. Tidak diproses saat impor."],
  ["Status Pembayaran", "Otomatis. Tidak diproses saat impor."],
  ["Jumlah Dibayar", "Otomatis. Tidak diproses saat impor."]
];
function buildParticipantTemplateWorkbook() {
  const { workbook, sheet } = createParticipantWorkbook();
  const genderList = '"L,P"';
  const genderColIndex = PARTICIPANT_COLUMNS.findIndex((c) => c.key === "gender") + 1;
  for (let row = 2; row <= 501; row++) {
    sheet.getCell(row, genderColIndex).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [genderList]
    };
  }
  sheet.addRow({
    no: 1,
    fullName: "Contoh Nama Peserta",
    email: "peserta@email.com",
    phone: "081234567890",
    nik: "3374011234560001",
    gender: "L",
    birthPlace: "Jakarta",
    birthDate: /* @__PURE__ */ new Date("2000-01-15"),
    lastEducation: "S1",
    major: "Teknik Informatika",
    educationInstitution: "Universitas Contoh",
    currentActivity: "Fresh Graduate",
    maritalStatus: "Belum Menikah",
    parentPhone: "081298765432",
    parentRelationship: "Ayah",
    ktpProvinceName: "Jawa Tengah",
    ktpCityName: "Kota Semarang",
    ktpAddress: "Jl. Contoh No. 1, RT 01/RW 02, Kel. Contoh, Kec. Contoh",
    domicileProvinceName: "DKI Jakarta",
    domicileCityName: "Jakarta Selatan",
    domicileAddress: "Jl. Domisili No. 5, RT 03/RW 04, Kel. Contoh, Kec. Contoh",
    programName: "Nama Program (sesuai sistem)"
  });
  const guide = workbook.addWorksheet(PARTICIPANT_INSTRUCTION_SHEET_NAME);
  guide.columns = [
    { header: "Kolom", key: "column", width: 25 },
    { header: "Keterangan", key: "note", width: 80 }
  ];
  const guideHeader = guide.getRow(1);
  guideHeader.font = { bold: true };
  guideHeader.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PARTICIPANT_HEADER_FILL } };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  });
  PARTICIPANT_INSTRUCTIONS.forEach(([column, note]) => guide.addRow({ column, note }));
  guide.addRow({});
  guide.addRow({
    column: "CATATAN",
    note: "Kolom yang tidak diisi akan diabaikan. Pastikan kolom Email dan Program sudah sesuai dengan data yang ada di sistem. Maksimal 500 baris per impor."
  });
  return workbook;
}

// src/services/admin/participant.service.ts
function buildParticipantWhere(filters2) {
  return {
    ...filters2.programId ? { programId: filters2.programId } : {},
    ...filters2.registrationStatus ? { registrationStatus: filters2.registrationStatus } : {},
    ...filters2.search ? {
      OR: [
        { registrationCode: { contains: filters2.search } },
        { user: { name: { contains: filters2.search } } },
        { user: { email: { contains: filters2.search } } },
        { user: { phone: { contains: filters2.search } } },
        { nik: { contains: filters2.search } }
      ]
    } : {}
  };
}
var participantExportInclude = {
  user: { select: { name: true, email: true, phone: true } },
  program: { select: { name: true, programFormat: true } },
  selectionStatuses: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 },
  placementStatuses: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 },
  payments: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true, amountPaid: true } }
};
function toExportRow(reg) {
  const [selection] = reg.selectionStatuses;
  const [placement] = reg.placementStatuses;
  const [payment] = reg.payments;
  return {
    registrationCode: reg.registrationCode,
    registrationDate: reg.registrationDate,
    registrationStatus: reg.registrationStatus,
    fullName: reg.user?.name ?? "",
    email: reg.user?.email ?? "",
    phone: reg.user?.phone ?? null,
    nik: reg.nik,
    gender: reg.gender,
    birthPlace: reg.birthPlace,
    birthDate: reg.birthDate,
    lastEducation: reg.lastEducation,
    major: reg.major,
    educationInstitution: reg.educationInstitution,
    currentActivity: reg.currentActivity,
    maritalStatus: reg.maritalStatus,
    parentPhone: reg.parentPhone,
    parentRelationship: reg.parentRelationship,
    ktpProvinceName: reg.ktpProvinceName,
    ktpCityName: reg.ktpCityName,
    ktpAddress: reg.ktpAddress,
    domicileProvinceName: reg.domicileProvinceName,
    domicileCityName: reg.domicileCityName,
    domicileAddress: reg.domicileAddress,
    programName: reg.program?.name ?? "",
    programFormat: reg.program?.programFormat ?? null,
    selectionStatus: selection?.status ?? null,
    placementStatus: placement?.status ?? null,
    companyName: placement?.companyName ?? null,
    placementDate: placement?.placementDate ?? null,
    paymentStatus: payment?.status ?? null,
    amountPaid: payment?.amountPaid?.toString() ?? null
  };
}
async function exportParticipants(filters2) {
  const where = buildParticipantWhere(filters2);
  const [registrations2, unregisteredUsers] = await Promise.all([
    prisma_default.registration.findMany({
      where,
      include: participantExportInclude,
      orderBy: { registrationDate: "desc" }
    }),
    !filters2.programId && !filters2.registrationStatus ? prisma_default.user.findMany({
      where: {
        role: "user",
        registrations: { none: {} },
        ...filters2.search ? {
          OR: [
            { name: { contains: filters2.search } },
            { email: { contains: filters2.search } },
            { phone: { contains: filters2.search } }
          ]
        } : {}
      },
      select: { name: true, email: true, phone: true, birthPlace: true, birthDate: true, address: true },
      orderBy: { createdAt: "desc" }
    }) : Promise.resolve([])
  ]);
  return [
    ...registrations2.map(toExportRow),
    ...unregisteredUsers.map((user) => ({
      registrationCode: "",
      registrationDate: null,
      registrationStatus: "",
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      nik: null,
      gender: null,
      birthPlace: user.birthPlace,
      birthDate: user.birthDate,
      lastEducation: null,
      major: null,
      educationInstitution: null,
      currentActivity: null,
      maritalStatus: null,
      parentPhone: null,
      parentRelationship: null,
      ktpProvinceName: null,
      ktpCityName: null,
      ktpAddress: null,
      domicileProvinceName: null,
      domicileCityName: null,
      domicileAddress: user.address,
      programName: "",
      programFormat: null,
      selectionStatus: null,
      placementStatus: null,
      companyName: null,
      placementDate: null,
      paymentStatus: null,
      amountPaid: null
    }))
  ];
}
async function importParticipants(rows, dryRun = false) {
  const errors = [];
  const validUpdates = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;
    const user = await prisma_default.user.findUnique({
      where: { email: row.email.toLowerCase() },
      select: { id: true }
    });
    if (!user) {
      errors.push({ row: rowNum, email: row.email, programName: row.programName, reason: "User dengan email ini tidak ditemukan." });
      continue;
    }
    const program = await prisma_default.program.findFirst({
      where: { name: row.programName },
      select: { id: true }
    });
    if (!program) {
      errors.push({ row: rowNum, email: row.email, programName: row.programName, reason: `Program "${row.programName}" tidak ditemukan.` });
      continue;
    }
    const registration = await prisma_default.registration.findFirst({
      where: { userId: user.id, programId: program.id },
      select: { id: true }
    });
    if (!registration) {
      errors.push({ row: rowNum, email: row.email, programName: row.programName, reason: `Peserta belum mendaftar ke program "${row.programName}".` });
      continue;
    }
    const regData = {};
    if (row.nik !== void 0) regData.nik = row.nik;
    if (row.gender !== void 0) regData.gender = row.gender ?? null;
    if (row.birthPlace !== void 0) regData.birthPlace = row.birthPlace;
    if (row.birthDate !== void 0) regData.birthDate = row.birthDate ? new Date(row.birthDate) : null;
    if (row.lastEducation !== void 0) regData.lastEducation = row.lastEducation;
    if (row.major !== void 0) regData.major = row.major;
    if (row.educationInstitution !== void 0) regData.educationInstitution = row.educationInstitution;
    if (row.currentActivity !== void 0) regData.currentActivity = row.currentActivity;
    if (row.maritalStatus !== void 0) regData.maritalStatus = row.maritalStatus;
    if (row.parentPhone !== void 0) regData.parentPhone = row.parentPhone;
    if (row.parentRelationship !== void 0) regData.parentRelationship = row.parentRelationship;
    if (row.ktpProvinceName !== void 0) regData.ktpProvinceName = row.ktpProvinceName;
    if (row.ktpCityName !== void 0) regData.ktpCityName = row.ktpCityName;
    if (row.ktpAddress !== void 0) regData.ktpAddress = row.ktpAddress;
    if (row.domicileProvinceName !== void 0) regData.domicileProvinceName = row.domicileProvinceName;
    if (row.domicileCityName !== void 0) regData.domicileCityName = row.domicileCityName;
    if (row.domicileAddress !== void 0) regData.domicileAddress = row.domicileAddress;
    const userUpdate = {};
    if (row.fullName) userUpdate.name = row.fullName;
    if (row.phone !== void 0) userUpdate.phone = row.phone;
    validUpdates.push({ registrationId: registration.id, data: regData, userUpdate: Object.keys(userUpdate).length > 0 ? userUpdate : void 0 });
  }
  if (errors.length > 0) {
    return { success: 0, errors, committed: false };
  }
  if (dryRun) {
    return { success: validUpdates.length, errors: [], committed: false };
  }
  await prisma_default.$transaction(async (tx) => {
    for (const item of validUpdates) {
      if (Object.keys(item.data).length > 0) {
        await tx.registration.update({ where: { id: item.registrationId }, data: item.data });
      }
      if (item.userUpdate) {
        const reg = await tx.registration.findUnique({ where: { id: item.registrationId }, select: { userId: true } });
        if (reg?.userId) {
          await tx.user.update({ where: { id: reg.userId }, data: item.userUpdate });
        }
      }
    }
  });
  return { success: validUpdates.length, errors: [], committed: true };
}

// src/services/admin/participant.import.ts
import ExcelJS3 from "exceljs";
function unwrapCell2(value) {
  if (value === null || value === void 0) return null;
  if (value instanceof Date || typeof value === "number") return value;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "string") return value.trim() === "" ? null : value.trim();
  const obj = value;
  if (Array.isArray(obj.richText)) {
    const text = obj.richText.map((p) => p.text ?? "").join("").trim();
    return text === "" ? null : text;
  }
  if ("result" in obj) return unwrapCell2(obj.result);
  if ("text" in obj) return unwrapCell2(obj.text);
  return null;
}
var normalizeHeader2 = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
function cellToString(val) {
  if (val === null) return null;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === "number") return String(val);
  return val;
}
function cellToDate(val) {
  if (val === null) return null;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === "string") {
    const ddmmyyyy = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, "0")}-${ddmmyyyy[1].padStart(2, "0")}`;
    return val;
  }
  return null;
}
async function parseParticipantImportFile(buffer) {
  const workbook = new ExcelJS3.Workbook();
  try {
    await workbook.xlsx.load(buffer);
  } catch {
    throw new Error("File tidak dapat dibaca. Pastikan format file adalah .xlsx.");
  }
  const sheet = workbook.getWorksheet("Data Peserta") ?? workbook.worksheets[0];
  if (!sheet) throw new Error("Sheet tidak ditemukan di file.");
  const columnIndex = /* @__PURE__ */ new Map();
  const headerByNormalized = new Map(
    PARTICIPANT_COLUMNS.map((c) => [normalizeHeader2(c.header), c.key])
  );
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const text = unwrapCell2(cell.value);
    const key = typeof text === "string" ? headerByNormalized.get(normalizeHeader2(text)) : void 0;
    if (key && !columnIndex.has(key)) columnIndex.set(key, colNumber);
  });
  const missing = PARTICIPANT_REQUIRED_COLUMNS.filter((key) => !columnIndex.has(key));
  if (missing.length > 0) {
    const missingHeaders = missing.map((key) => PARTICIPANT_COLUMNS.find((c) => c.key === key)?.header ?? key);
    throw new Error(`Kolom wajib tidak ditemukan: ${missingHeaders.join(", ")}`);
  }
  const rows = [];
  const parseErrors = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    const getCellVal = (key) => {
      const idx = columnIndex.get(key);
      return idx ? unwrapCell2(row.getCell(idx).value) : null;
    };
    const emailRaw = cellToString(getCellVal("email"));
    const programNameRaw = cellToString(getCellVal("programName"));
    const fullNameRaw = cellToString(getCellVal("fullName"));
    if (!emailRaw && !programNameRaw && !fullNameRaw) continue;
    if (!emailRaw) {
      parseErrors.push({ row: rowNumber, reason: "Email wajib diisi." });
      continue;
    }
    if (!programNameRaw) {
      parseErrors.push({ row: rowNumber, reason: "Nama program wajib diisi." });
      continue;
    }
    if (!fullNameRaw) {
      parseErrors.push({ row: rowNumber, reason: "Nama lengkap wajib diisi." });
      continue;
    }
    const genderRaw = cellToString(getCellVal("gender"));
    const validGenders = ["L", "P", null];
    if (genderRaw && !validGenders.includes(genderRaw.toUpperCase())) {
      parseErrors.push({ row: rowNumber, reason: `Jenis kelamin tidak valid: "${genderRaw}". Gunakan L atau P.` });
      continue;
    }
    rows.push({
      fullName: fullNameRaw,
      email: emailRaw.toLowerCase(),
      phone: cellToString(getCellVal("phone")),
      nik: cellToString(getCellVal("nik")),
      gender: genderRaw ? genderRaw.toUpperCase() : null,
      birthPlace: cellToString(getCellVal("birthPlace")),
      birthDate: cellToDate(getCellVal("birthDate")),
      lastEducation: cellToString(getCellVal("lastEducation")),
      major: cellToString(getCellVal("major")),
      educationInstitution: cellToString(getCellVal("educationInstitution")),
      currentActivity: cellToString(getCellVal("currentActivity")),
      maritalStatus: cellToString(getCellVal("maritalStatus")),
      parentPhone: cellToString(getCellVal("parentPhone")),
      parentRelationship: cellToString(getCellVal("parentRelationship")),
      ktpProvinceName: cellToString(getCellVal("ktpProvinceName")),
      ktpCityName: cellToString(getCellVal("ktpCityName")),
      ktpAddress: cellToString(getCellVal("ktpAddress")),
      domicileProvinceName: cellToString(getCellVal("domicileProvinceName")),
      domicileCityName: cellToString(getCellVal("domicileCityName")),
      domicileAddress: cellToString(getCellVal("domicileAddress")),
      programName: programNameRaw
    });
    if (rows.length > IMPORT_PARTICIPANT_LIMITS.maxRows) {
      throw new Error(`Jumlah baris melebihi batas maksimal ${IMPORT_PARTICIPANT_LIMITS.maxRows} baris.`);
    }
  }
  if (rows.length === 0 && parseErrors.length === 0) {
    throw new Error("File tidak memiliki data peserta. Pastikan data dimulai dari baris ke-2.");
  }
  return { rows, parseErrors };
}

// src/controllers/admin/participant.controller.ts
var JAKARTA_OFFSET_MS7 = 7 * 36e5;
var todayStamp2 = () => new Date(Date.now() + JAKARTA_OFFSET_MS7).toISOString().slice(0, 10).replace(/-/g, "");
async function sendWorkbook2(res, filename, workbook) {
  res.setHeader("Content-Type", XLSX_MIME2);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "private, no-store");
  await workbook.xlsx.write(res);
  res.end();
}
async function exportXlsx2(req, res, next) {
  try {
    const filters2 = matchedData12(req);
    const rows = await exportParticipants(filters2);
    return await sendWorkbook2(res, `data-peserta-${todayStamp2()}.xlsx`, buildParticipantWorkbook(rows));
  } catch (err) {
    next(err);
  }
}
async function template2(_req, res, next) {
  try {
    return await sendWorkbook2(res, "template-data-peserta-fitalenta.xlsx", buildParticipantTemplateWorkbook());
  } catch (err) {
    next(err);
  }
}
async function importXlsx2(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File wajib diunggah." });
  }
  const { dryRun = false } = matchedData12(req);
  let parseResult;
  try {
    parseResult = await parseParticipantImportFile(req.file.buffer);
  } catch (err) {
    return res.status(422).json({ success: false, message: err.message });
  }
  if (parseResult.parseErrors.length > 0) {
    return res.status(422).json({
      success: false,
      message: "Terdapat kesalahan pada format data di file.",
      data: { committed: false, errors: parseResult.parseErrors, success: 0 }
    });
  }
  const result = await importParticipants(parseResult.rows, dryRun);
  const message = dryRun ? "Pemeriksaan file selesai" : result.committed ? `${result.success} data peserta berhasil diimpor` : "Impor dibatalkan karena ada data yang tidak valid";
  return res.status(result.errors.length > 0 ? 422 : 200).json({ success: result.errors.length === 0, message, data: result });
}

// src/validators/participant.validator.ts
import { query as query7 } from "express-validator";
var exportParticipantRules = [
  query7("search").optional().trim().isString(),
  query7("programId").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("programId harus integer positif").toInt(),
  query7("registrationStatus").optional({ values: "falsy" }).isIn(["menunggu", "lolos", "tidak_lolos"]).withMessage("registrationStatus tidak valid"),
  query7("dryRun").optional().isBoolean().toBoolean()
];
var importParticipantRules = [
  query7("dryRun").optional().isBoolean().toBoolean()
];

// src/routes/admin/participant.routes.ts
var router29 = Router29();
router29.use(...superAdminAccess);
router29.get("/export", validate(exportParticipantRules), exportXlsx2);
router29.get("/template", template2);
router29.post(
  "/import",
  uploadParticipantSpreadsheet.single("file"),
  validate(importParticipantRules),
  importXlsx2
);
var participant_routes_default = router29;

// src/routes/index.ts
var router30 = Router30();
router30.use("/auth", auth_routes_default);
router30.use("/events", event_routes_default);
router30.use("/admin/events", event_routes_default2);
router30.use("/articles", article_routes_default);
router30.use("/admin/articles", article_routes_default2);
router30.use("/contact", contact_routes_default);
router30.use("/services", service_routes_default);
router30.use("/admin/services", service_routes_default2);
router30.use("/gallery", gallery_routes_default);
router30.use("/admin/gallery", gallery_routes_default2);
router30.use("/testimonials", testimonial_routes_default);
router30.use("/admin/testimonials", testimonial_routes_default2);
router30.use("/programs", program_routes_default);
router30.use("/admin/programs", program_routes_default2);
router30.use("/team-members", teamMember_routes_default);
router30.use("/admin/team-members", teamMember_routes_default2);
router30.use("/user/dashboard", dashboard_routes_default);
router30.use("/user/profile", profile_routes_default);
router30.use("/user/registrations", registration_routes_default);
router30.use("/admin/payments", payment_routes_default);
router30.use("/user/payments", payment_routes_default2);
router30.use("/user/notifications", notification_routes_default);
router30.use("/admin/dashboard", dashboard_routes_default2);
router30.use("/admin/users", user_routes_default);
router30.use("/admin/selection-placements", selectionPlacement_routes_default);
router30.use("/admin/financial-reports", financialReport_routes_default);
router30.use("/admin/cms", cms_routes_default);
router30.use("/admin/program-categories", programCategory_routes_default);
router30.use("/admin/participants", participant_routes_default);
var routes_default = router30;

// src/middlewares/error-handler.ts
import multer2 from "multer";
var MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: "Ukuran file melebihi batas maksimal 5 MB",
  LIMIT_UNEXPECTED_FILE: "Field file tidak dikenali"
};
function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      success: false,
      code: error.code,
      message: error.message,
      ...error.details ? { errors: error.details } : {}
    });
  }
  if (error instanceof multer2.MulterError) {
    return res.status(400).json({
      success: false,
      code: error.code,
      message: MULTER_MESSAGES[error.code] ?? error.message
    });
  }
  console.error("Unhandled error:", error);
  return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
}

// src/index.ts
dotenv.config();
var app = express();
var PORT = process.env.PORT || 5e3;
if (process.env.TRUST_PROXY) {
  const v = process.env.TRUST_PROXY;
  app.set("trust proxy", /^\d+$/.test(v) ? Number(v) : v === "true" ? true : v);
}
var corsOriginEnv = process.env.CORS_ORIGIN || "http://localhost:3000";
var allowedOrigins = corsOriginEnv.split(",").map((o) => o.trim());
allowedOrigins.forEach((origin) => {
  if (origin.startsWith("https://") && !origin.includes("www.")) {
    allowedOrigins.push(origin.replace("https://", "https://www."));
  }
});
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path9.join(process.cwd(), "uploads")));
app.use("/team-members", express.static(path9.join(process.cwd(), "uploads", "team-members")));
app.get("/team-members/{*file}", (req, res) => {
  const filePath = Array.isArray(req.params.file) ? req.params.file.join("/") : req.params.file;
  res.redirect(`https://www.fitalenta.co.id/storage/team-members/${encodeURI(filePath)}`);
});
app.get("/uploads/{*file}", (req, res) => {
  const filePath = Array.isArray(req.params.file) ? req.params.file.join("/") : req.params.file;
  res.redirect(`https://www.fitalenta.co.id/storage/${encodeURI(filePath)}`);
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Fitalenta backend is running" });
});
app.use("/api", routes_default);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
var index_default = app;
export {
  index_default as default
};
