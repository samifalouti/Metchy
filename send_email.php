<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = htmlspecialchars($_POST['fullNameInput']);
    $number = htmlspecialchars($_POST['numberInput']);
    $message = htmlspecialchars($_POST['messageInput']);

    if (empty($fullName) || empty($number) || empty($message)) {
        http_response_code(400);
        echo "All fields are required.";
        exit;
    }

    if (!filter_var($number, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid email address.";
        exit;
    }

    $to = "samifalouti02@gmail.com";
    $subject = "New message from contact form";
    $emailMessage = "Full Name: $fullName\n";
    $emailMessage .= "Phone Number: $number\n";
    $emailMessage .= "Message:\n$message";

    if (mail($to, $subject, $emailMessage)) {
        http_response_code(200);
        echo "Email sent successfully!";
    } else {
        http_response_code(500);
        echo "Failed to send email. Please try again later.";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>
