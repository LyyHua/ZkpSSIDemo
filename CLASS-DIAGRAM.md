# Class Diagram for Library Management System

This class diagram represents the structure of the Library Management System. The diagram shows the relationships between various entities in the system, along with their properties and operations.

## Database Schema Class Diagram

```mermaid
classDiagram
    %% Core Domain Entities
    class User {
        <<Entity>>
        +id: string
        +cccd: string
        +dob: date
        +avatar_url: string
        +name: string
        +email: string
        -password: string
        +role: string
        +balance: int
        +login(email: string, password: string): boolean
        +viewDepositBalance(): int
        +searchBooks(keywords: string): BookTitle[]
    }

    class BookTitle {
        <<Entity>>
        +id: string
        +image_url: string
        +title: string
        +ISBN: string
        +published_date: date
        +can_borrow: boolean
        +getDetails(): Object
        +getAvailableCopies(): BookCopy[]
    }

    class BookCopy {
        <<Entity>>
        +id: string
        +book_title_id: string
        +status: string
        +isAvailable(): boolean
        +updateStatus(status: string): void
    }

    class Transaction {
        <<Entity>>
        +id: string
        +borrow_date: date
        +due_date: date
        +user_id: string
        +createBorrowTransaction(user_id: string): void
        +getTransactionDetails(): TransactionDetail[]
    }

    class TransactionDetail {
        <<Entity>>
        +transaction_id: string
        +book_copy_id: string
        +returned_date: date
        +penalty_fee: int
        +recordReturn(): void
        +assessCondition(condition: string, damage: boolean): void
        +calculatePenalty(): int
    }

    class Reservation {
        <<Entity>>
        +id: string
        +reservation_date: date
        +expiration_date: date
        +status: string
        +deposit: int
        +user_id: string
        +book_title_id: string
        +book_copy_id: string
        +createReservation(user_id: string, book_title_id: string): void
        +checkStatus(): string
        +isExpired(): boolean
    }

    class Review {
        <<Entity>>
        +id: string
        +date: date
        +comment: string
        +star: int
        +book_title_id: string
        +user_id: string
        +createReview(book_title_id: string, user_id: string): void
        +validateContent(): boolean
    }

    class Author {
        <<Entity>>
        +id: string
        +avatar_url: string
        +name: string
        +birthday: date
        +biography: string
        +getBooks(): BookTitle[]
    }

    class Category {
        <<Entity>>
        +id: string
        +name: string
        +description: string
        +getBooks(): BookTitle[]
    }

    class Publisher {
        <<Entity>>
        +id: string
        +logo_url: string
        +name: string
        +address: string
        +email: string
        +phone: string
        +getPublishedBooks(): BookTitle[]
    }

    class BookAuthor {
        <<RelationshipEntity>>
        +book_title_id: string
        +author_id: string
    }

    class BookCategory {
        <<RelationshipEntity>>
        +book_title_id: string
        +category_id: string
    }
      %% Service Components
    class AuthenticationService {
        <<Service>>
        +login(email: string, password: string): boolean
        +logout(): void
        +register(userData: Object): boolean
        +resetPassword(email: string): boolean
    }

    class BookService {
        <<Service>>
        +searchBooks(keywords: string): BookTitle[]
        +getBookDetails(bookId: string): Object
        +checkAvailability(bookId: string): boolean
        +getPopularBooks(): BookTitle[]
    }

    class TransactionService {
        <<Service>>
        +createTransaction(userId: string, bookCopyId: string): Transaction
        +returnBook(transactionId: string): boolean
        +getUserTransactions(userId: string): Transaction[]
        +calculatePenalty(transactionId: string): number
    }

    class ReservationService {
        <<Service>>
        +createReservation(userId: string, bookTitleId: string): Reservation
        +cancelReservation(reservationId: string): boolean
        +getUserReservations(userId: string): Reservation[]
        +checkReservationStatus(reservationId: string): string
    }

    %% Relationships
    BookTitle "1" --> "*" BookCopy
    BookTitle "*" -- "*" Author
    BookTitle "*" -- "*" Category
    BookTitle "1" --> "*" Review
    BookTitle "1" --> "*" Reservation
    BookTitle "*" --> "1" Publisher

    User "1" --> "*" Transaction
    User "1" --> "*" Review
    User "1" --> "*" Reservation

    Transaction "1" --> "*" TransactionDetail
    TransactionDetail "*" --> "1" BookCopy

    Reservation "*" --> "1" BookCopy

    BookAuthor "*" --> "1" Author
    BookAuthor "*" --> "1" BookTitle

    BookCategory "*" --> "1" Category
    BookCategory "*" --> "1" BookTitle
      AuthenticationService --> User : manages
    BookService --> BookTitle : manages
    BookService --> BookCopy : manages
    TransactionService --> Transaction : manages
    ReservationService --> Reservation : manages
```

## Controller and View Classes

```mermaid
classDiagram
    class UserController {
        <<Controller>>
        +login(credentials: Object): boolean
        +register(userData: Object): boolean
        +updateProfile(userData: Object): boolean
        +viewHistory(): Transaction[]
    }

    class BookController {
        <<Controller>>
        +searchBooks(query: Object): BookTitle[]
        +viewBookDetails(bookId: string): Object
        +rateBook(bookId: string, rating: Object): boolean
        +reserveBook(bookId: string): boolean
    }

    class LibrarianController {
        <<Controller>>
        +processBookLoan(userId: string, bookId: string): Transaction
        +processBookReturn(transactionId: string): boolean
        +manageReservations(action: string, reservationId: string): boolean
        +manageUserAccounts(action: string, userId: string): boolean
    }

    class AdminController {
        <<Controller>>
        +manageBooks(action: string, bookData: Object): boolean
        +manageAuthors(action: string, authorData: Object): boolean
        +manageCategories(action: string, categoryData: Object): boolean
        +generateReports(reportType: string): Object
    }

    class DashboardView {
        <<View>>
        +displayUserInfo(user: User): void
        +displayCurrentLoans(transactions: Transaction[]): void
        +displayReservations(reservations: Reservation[]): void
        +displayNotifications(notifications: Object[]): void
    }

    class CatalogView {
        <<View>>
        +displaySearchResults(books: BookTitle[]): void
        +displayBookDetails(book: Object): void
        +displayReviews(reviews: Review[]): void
        +renderReservationForm(bookId: string): void
    }

    UserController --> AuthenticationService : uses
    BookController --> BookService : uses
    LibrarianController --> TransactionService : uses
    LibrarianController --> ReservationService : uses
    AdminController --> BookService : uses
```

## Mapping to Use Cases

The class diagram above maps to the various use cases described in the activity and sequence diagrams:

### Authentication and User Management

-   User authentication (Sequence Diagram #1) uses User and AuthenticationService classes
-   User registration uses User and AuthenticationService classes
-   Profile management uses User and UserController classes

### Book Management

-   Book search (Sequence Diagram #2) uses BookTitle, BookService, and CatalogView
-   Book details view (Sequence Diagram #3) uses BookTitle, Author, Category, Publisher, and CatalogView
-   Book rating (Sequence Diagram #4) uses User, BookTitle, Review, and BookController
-   Book reservation (Sequence Diagram #5) uses User, BookTitle, BookCopy, Reservation, and ReservationService

### Borrowing Workflows

-   View reserved books (Sequence Diagram #6) uses User, Reservation, and DashboardView
-   Borrow reserved book (Sequence Diagram #7) uses Reservation, Transaction, and LibrarianController
-   Book borrowing (Sequence Diagram #8) uses User, BookCopy, Transaction, and LibrarianController
-   Book return (Sequence Diagram #9) uses Transaction, TransactionDetail, and LibrarianController
-   Book condition assessment (Sequence Diagram #10) uses TransactionDetail and LibrarianController

### Administrative Functions

-   Manage books (Sequence Diagram #18) uses BookTitle, BookCopy, and AdminController
-   Manage authors (Sequence Diagram #19) uses Author and AdminController
-   Manage categories (Sequence Diagram #20) uses Category and AdminController
-   Manage users (Sequence Diagram #21) uses User and AdminController
-   View statistics (Sequence Diagram #23) uses various entities and AdminController

This class diagram captures the entire database schema and necessary components for implementing the Library Management System, providing a comprehensive view of the application architecture.
