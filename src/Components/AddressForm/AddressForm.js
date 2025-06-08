import React, { useState, useEffect } from "react";
import FormField from "../FormField/FormField";
import { getAllCountries, getCountrySates, getSatesCities } from "../../Services/utilityService";

const AddressForm = ({ setParentFormData, formErrors, initialData }) => {
	const [formData, setFormData] = useState({
		street1: initialData?.street1 || "",
		street2: initialData?.street2 || "",
		city: initialData?.city || "",
		state: initialData?.state || "",
		country: initialData?.country || "",
		zip: initialData?.zip || "",
		address: initialData?.address || "",
	});
	const [countries, setCountries] = useState([]);
	const [allCountries, setAllCountries] = useState([]);
	const [states, setStates] = useState([]);
	const [cities, setCities] = useState([]);

	useEffect(() => {
		if (initialData)
			setFormData({
				street1: initialData?.street1 || "",
				street2: initialData?.street2 || "",
				city: initialData?.city || "",
				state: initialData?.state || "",
				country: initialData?.country || "",
				zip: initialData?.zip || "",
				address: initialData?.address || "",
			});
	}, [initialData]);

	useEffect(() => {
		if (initialData && countries.length > 0) {
			setFormData((prev) => ({
				...prev,
				country: initialData.country || "",
			}));
		}
		// eslint-disable-next-line
	}, [countries, initialData]);

	// // 2. Set state after states are loaded
	useEffect(() => {
		if (initialData && countries.length > 0 && initialData.country && states.length > 0 && initialData.state) {
			setFormData((prev) => ({
				...prev,
				state: initialData.state || "",
			}));
		}
		// eslint-disable-next-line
	}, [countries, states, initialData]);

	// // 3. Set city after cities are loaded
	useEffect(() => {
		if (
			initialData &&
			countries.length > 0 &&
			initialData.country &&
			states.length > 0 &&
			cities.length > 0 &&
			initialData.city
		) {
			setFormData((prev) => ({
				...prev,
				city: initialData.city || "",
			}));
		}
		// eslint-disable-next-line
	}, [countries, states, cities, initialData]);

	// Fetch countries on mount
	useEffect(() => {
		fetchCountries();
	}, []);

	// Fetch states when country changes
	useEffect(() => {
		fetchStates(formData.country);
		setFormData((prev) => ({ ...prev, state: "", city: "" }));
		setCities([]);
		// eslint-disable-next-line
	}, [formData.country]);

	// Fetch cities when state changes
	useEffect(() => {
		if (formData.country && formData.state) {
			fetchCities(formData.country, formData.state);
		} else {
			setCities([]);
		}
		setFormData((prev) => ({ ...prev, city: "" }));
		// eslint-disable-next-line
	}, [formData.state]);

	const fetchCountries = async () => {
		const response = await getAllCountries();
		if (response.status) {
			const ctries = response.data;
			if (ctries) {
				setCountries(
					ctries.map((c) => ({
						label: c.name,
						value: c.name,
					}))
				);
				setAllCountries(ctries);
			}
		} else {
			setCountries([]);
			setAllCountries([]);
		}
	};

	const fetchStates = async (country) => {
		const response = await getCountrySates(country);
		if (response.status) {
			setStates(
				response.data.map((c) => ({
					label: c.name,
					value: c.name,
				}))
			);
		} else {
			setStates([]);
		}
	};

	const fetchCities = async (country, state) => {
		const response = await getSatesCities(country, state);
		if (response.status) {
			setCities(
				response.data.map((c) => ({
					label: c.name,
					value: c.name,
				}))
			);
		} else {
			setCities([]);
		}
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		const updatedFormData = { ...formData, [name]: value };

		// Combine all fields into address string
		const address = [
			updatedFormData.street1,
			updatedFormData.street2,
			updatedFormData.city,
			updatedFormData.state,
			updatedFormData.country,
			updatedFormData.zip,
		]
			.filter(Boolean)
			.join(", ");

		updatedFormData.address = address;
		setFormData(updatedFormData);

		// Merge with parent form data
		setParentFormData((prev) => ({
			...prev,
			...updatedFormData,
		}));
	};

	return (
		<>
			<FormField
				type="autocomplete"
				label="Country"
				name="country"
				value={formData.country}
				error={formErrors.country}
				onChange={handleFormChange}
				options={countries}
				showRequired={true}
			/>
			<FormField
				type="text"
				label="Street 1"
				name="street1"
				value={formData.street1}
				error={formErrors.street1}
				onChange={handleFormChange}
				showRequired={true}
			/>
			<FormField
				type="text"
				label="Street 2"
				name="street2"
				value={formData.street2}
				error={formErrors.street2}
				onChange={handleFormChange}
			/>
			<FormField
				type="autocomplete"
				label="State"
				name="state"
				value={formData.state}
				error={formErrors.state}
				onChange={handleFormChange}
				options={states}
				showRequired={true}
			/>
			<FormField
				type="autocomplete"
				label="City"
				name="city"
				value={formData.city}
				error={formErrors.city}
				onChange={handleFormChange}
				options={cities}
				showRequired={cities.length > 0 ? true : false}
			/>
			<FormField
				type="text"
				label="Zip"
				name="zip"
				value={formData.zip}
				error={formErrors.zip}
				onChange={handleFormChange}
				showRequired={true}
			/>
		</>
	);
};

export default AddressForm;
