import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, errorInfo: error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Uncaught error:", error, errorInfo);
		this.handleError();
	}

	handleError = () => {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "Something went wrong",
			confirmButtonText: "Go Back",
		}).then((result) => {
			if (result.isConfirmed) {
				if (window.history.length > 1) {
					this.props.navigate(-1);
				} else {
					this.props.navigate("/home");
				}
				this.resetErrorState();
			} else {
				this.props.navigate("/home");
				this.resetErrorState();
			}
		});
	};

	resetErrorState = () => {
		this.setState({ hasError: false, errorInfo: null });
	};

	render() {
		const { hasError } = this.state;

		if (hasError) {
			return <div>An unexpected error has occurred. Please try again.</div>;
		}

		return this.props.children;
	}
}

function ErrorBoundaryWrapper(props) {
	const navigate = useNavigate();

	return <ErrorBoundary {...props} navigate={navigate} />;
}

export default ErrorBoundaryWrapper;
