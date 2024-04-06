<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form data and sanitize inputs
    $fullName = htmlspecialchars($_POST['fullNameInput']);
    $number = htmlspecialchars($_POST['numberInput']);
    $message = htmlspecialchars($_POST['messageInput']);

    // Validate inputs
    if (empty($fullName) || empty($number) || empty($message)) {
        // Required fields are empty
        http_response_code(400);
        echo "All fields are required.";
        exit;
    }

    // Validate email address (optional)
    if (!filter_var($number, FILTER_VALIDATE_EMAIL)) {
        // Invalid email address
        http_response_code(400);
        echo "Invalid email address.";
        exit;
    }

    // Set up the recipient email address
    $to = "samifalouti02@gmail.com";
    // Set up the email subject
    $subject = "New message from contact form";
    // Set up the email message
    $emailMessage = "Full Name: $fullName\n";
    $emailMessage .= "Phone Number: $number\n";
    $emailMessage .= "Message:\n$message";

    // Send the email
    if (mail($to, $subject, $emailMessage)) {
        // Email sent successfully
        http_response_code(200);
        echo "Email sent successfully!";
    } else {
        // Failed to send email
        http_response_code(500);
        echo "Failed to send email. Please try again later.";
    }
} else {
    // If the request method is not POST
    http_response_code(405);
    echo "Method Not Allowed";
}
?>
